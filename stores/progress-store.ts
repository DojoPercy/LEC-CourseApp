import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { useCoursesStore } from "@/stores/courses-store";
import type { CourseProgress, UserCourse, UserSection } from "@/types/course";

interface PendingSync {
  sectionId: string;
  courseId: string;
}

interface ProgressState {
  enrolledCourses: UserCourse[];
  completedSections: UserSection[];
  pendingSyncs: PendingSync[];

  // Actions
  enrollInCourse: (courseId: string) => Promise<void>;
  unenrollFromCourse: (courseId: string) => void;
  markSectionComplete: (sectionId: string, courseId: string) => Promise<void>;
  setLastAccessedSection: (courseId: string, sectionId: string) => void;
  syncProgressFromApi: (courseId: string) => Promise<void>;
  flushPendingSyncs: () => Promise<void>;

  // Selectors
  isEnrolled: (courseId: string) => boolean;
  isSectionCompleted: (sectionId: string) => boolean;
  getCourseProgress: (courseId: string) => CourseProgress;
  getAllProgress: () => CourseProgress[];
  getEnrolledCourseIds: () => string[];
  getCompletedCourseCount: () => number;
  getTotalLessonsCompleted: () => number;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      enrolledCourses: [],
      completedSections: [],
      pendingSyncs: [],

      enrollInCourse: async (courseId) => {
        const { isEnrolled, enrolledCourses } = get();
        if (isEnrolled(courseId)) return;

        set({
          enrolledCourses: [
            ...enrolledCourses,
            {
              courseId,
              enrolledAt: new Date().toISOString(),
              completedAt: null,
              lastAccessedSectionId: null,
            },
          ],
        });

        try {
          await useCoursesStore.getState().enrollInCourse(courseId);
        } catch (e) {
          console.warn("[enrollInCourse] API call failed:", e);
        }
      },

      unenrollFromCourse: (courseId) => {
        const { enrolledCourses, completedSections, pendingSyncs } = get();
        set({
          enrolledCourses: enrolledCourses.filter((c) => c.courseId !== courseId),
          completedSections: completedSections.filter((s) => s.courseId !== courseId),
          pendingSyncs: pendingSyncs.filter((p) => p.courseId !== courseId),
        });
      },

      markSectionComplete: async (sectionId, courseId) => {
        const { completedSections, isSectionCompleted } = get();
        if (isSectionCompleted(sectionId)) return;

        // Optimistic local update always
        set({
          completedSections: [
            ...completedSections,
            { sectionId, courseId, completedAt: new Date().toISOString() },
          ],
        });

        const token = useAuthStore.getState().token;
        if (!token) return;

        const net = await NetInfo.fetch();
        if (!net.isConnected) {
          // Queue for later
          set((s) => ({
            pendingSyncs: [...s.pendingSyncs, { sectionId, courseId }],
          }));
          console.log("[markSectionComplete] offline — queued for sync");
          return;
        }

        try {
          await apiFetch(
            `/api/sections/${sectionId}/complete`,
            { method: "PATCH", body: JSON.stringify({ courseId }) },
            token
          );
        } catch (e) {
          // Network error mid-request — queue it
          set((s) => ({
            pendingSyncs: [...s.pendingSyncs, { sectionId, courseId }],
          }));
          console.warn("[markSectionComplete] request failed — queued for sync");
        }
      },

      flushPendingSyncs: async () => {
        const { pendingSyncs } = get();
        if (pendingSyncs.length === 0) return;

        const token = useAuthStore.getState().token;
        if (!token) return;

        const net = await NetInfo.fetch();
        if (!net.isConnected) return;

        const remaining: PendingSync[] = [];

        for (const item of pendingSyncs) {
          try {
            await apiFetch(
              `/api/sections/${item.sectionId}/complete`,
              { method: "PATCH", body: JSON.stringify({ courseId: item.courseId }) },
              token
            );
            console.log("[flushPendingSyncs] synced", item.sectionId);
          } catch {
            remaining.push(item);
          }
        }

        set({ pendingSyncs: remaining });
        if (remaining.length < pendingSyncs.length) {
          console.log(`[flushPendingSyncs] synced ${pendingSyncs.length - remaining.length} item(s), ${remaining.length} remaining`);
        }
      },

      setLastAccessedSection: (courseId, sectionId) => {
        const { enrolledCourses } = get();
        set({
          enrolledCourses: enrolledCourses.map((ec) =>
            ec.courseId === courseId
              ? { ...ec, lastAccessedSectionId: sectionId }
              : ec
          ),
        });
      },

      syncProgressFromApi: async (courseId) => {
        const token = useAuthStore.getState().token;
        if (!token) return;
        try {
          const data = await apiFetch<{
            sections: { sectionId: string; completed: boolean }[];
          }>(`/api/courses/${courseId}/progress`, {}, token);

          const completed = data.sections
            .filter((s) => s.completed)
            .map((s) => ({
              sectionId: s.sectionId,
              courseId,
              completedAt: new Date().toISOString(),
            }));

          const { completedSections } = get();
          const existing = new Set(completedSections.map((s) => s.sectionId));
          const newFromApi = completed.filter((s) => !existing.has(s.sectionId));

          set({ completedSections: [...completedSections, ...newFromApi] });
        } catch (e) {
          console.warn("[syncProgressFromApi] failed:", e);
        }
      },

      isEnrolled: (courseId) =>
        get().enrolledCourses.some((c) => c.courseId === courseId),

      isSectionCompleted: (sectionId) =>
        get().completedSections.some((s) => s.sectionId === sectionId),

      getCourseProgress: (courseId) => {
        const { completedSections } = get();
        const course = useCoursesStore.getState().getCourseById(courseId);
        const total = course?.sections?.length ?? 0;
        const completed = completedSections.filter((s) => s.courseId === courseId).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return {
          courseId,
          completedSections: completed,
          totalSections: total,
          percentage,
          isCompleted: total > 0 && completed >= total,
        };
      },

      getAllProgress: () => {
        const { enrolledCourses, getCourseProgress } = get();
        return enrolledCourses.map((ec) => getCourseProgress(ec.courseId));
      },

      getEnrolledCourseIds: () =>
        get().enrolledCourses.map((ec) => ec.courseId),

      getCompletedCourseCount: () =>
        get().getAllProgress().filter((p) => p.isCompleted).length,

      getTotalLessonsCompleted: () =>
        get().completedSections.length,
    }),
    {
      name: "progress-storage-v2",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
