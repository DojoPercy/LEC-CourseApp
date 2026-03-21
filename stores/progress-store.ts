import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import { useCoursesStore } from "@/stores/courses-store";
import type { CourseProgress, UserCourse, UserSection } from "@/types/course";

interface ProgressState {
  enrolledCourses: UserCourse[];
  completedSections: UserSection[];

  // Actions
  enrollInCourse: (courseId: string) => Promise<void>;
  unenrollFromCourse: (courseId: string) => void;
  markSectionComplete: (sectionId: string, courseId: string) => Promise<void>;
  setLastAccessedSection: (courseId: string, sectionId: string) => void;
  syncProgressFromApi: (courseId: string) => Promise<void>;

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

      enrollInCourse: async (courseId) => {
        const { isEnrolled, enrolledCourses } = get();
        if (isEnrolled(courseId)) return;

        // Optimistic local update
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

        // Sync to API
        try {
          await useCoursesStore.getState().enrollInCourse(courseId);
        } catch (e) {
          console.warn("[enrollInCourse] API call failed:", e);
          // Keep local enroll even if API fails (offline-friendly)
        }
      },

      unenrollFromCourse: (courseId) => {
        const { enrolledCourses, completedSections } = get();
        set({
          enrolledCourses: enrolledCourses.filter((c) => c.courseId !== courseId),
          completedSections: completedSections.filter((s) => s.courseId !== courseId),
        });
      },

      markSectionComplete: async (sectionId, courseId) => {
        const { completedSections, isSectionCompleted } = get();
        if (isSectionCompleted(sectionId)) return;

        // Optimistic local update
        set({
          completedSections: [
            ...completedSections,
            { sectionId, courseId, completedAt: new Date().toISOString() },
          ],
        });

        // Sync to API in background
        const token = useAuthStore.getState().token;
        if (token) {
          try {
            await apiFetch(
              `/api/sections/${sectionId}/complete`,
              { method: "PATCH", body: JSON.stringify({ courseId }) },
              token
            );
          } catch (e) {
            console.warn("[markSectionComplete] API sync failed:", e);
          }
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

      /** Pull real progress from API and merge into local state */
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
          // Merge: keep any local completions + add API ones
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
      name: "progress-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
