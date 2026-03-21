import { create } from "zustand";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";
import type { Course, MegaCenter } from "@/types/course";

interface CoursesState {
  courses: Course[];
  megaCenters: MegaCenter[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;

  fetchCourses: () => Promise<void>;
  fetchMegaCenters: () => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
  getCourseById: (id: string) => Course | undefined;
  setSearchQuery: (query: string) => void;
  getFilteredCourses: () => Course[];
  clearFilters: () => void;
}

export const useCoursesStore = create<CoursesState>((set, get) => ({
  courses: [],
  megaCenters: [],
  isLoading: false,
  error: null,
  searchQuery: "",

  fetchCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = useAuthStore.getState().token;
      const data = await apiFetch<Course[]>("/api/courses", {}, token);
      // Normalise: attach sectionsCount
      const courses = data.map((c) => ({
        ...c,
        sectionsCount: c.sections?.length ?? 0,
      }));
      set({ courses, isLoading: false });
    } catch (error: any) {
      set({ error: error.message ?? "Failed to load courses", isLoading: false });
    }
  },

  fetchMegaCenters: async () => {
    try {
      const data = await apiFetch<MegaCenter[]>("/api/mega-centers");
      set({ megaCenters: data });
    } catch {
      // Non-critical — swallow
    }
  },

  enrollInCourse: async (courseId) => {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error("Not authenticated");
    await apiFetch(`/api/courses/${courseId}/enroll`, { method: "POST" }, token);
  },

  getCourseById: (id) => get().courses.find((c) => c.id === id),

  setSearchQuery: (query) => set({ searchQuery: query }),

  getFilteredCourses: () => {
    const { courses, searchQuery } = get();
    if (!searchQuery.trim()) return courses;
    const q = searchQuery.toLowerCase();
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.description ?? "").toLowerCase().includes(q)
    );
  },

  clearFilters: () => set({ searchQuery: "" }),
}));
