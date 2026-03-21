/** Matches the real DB schema from LEC-course-platform */
export interface Section {
  id: string;
  courseId: string;
  title: string;
  videoUrl: string;        // HLS stream URL from DB
  sortOrder: number | null;
  // UI-only / not from DB:
  duration?: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  createdAt?: string;
  sections: Section[];
  // Computed / UI-only:
  sectionsCount?: number;
}

export interface MegaCenter {
  id: string;
  name: string;
  church?: string | null;
  zonalPastor?: string | null;
}

export interface UserCourse {
  courseId: string;
  enrolledAt: string;
  completedAt?: string | null;
  lastAccessedSectionId?: string | null;
}

export interface UserSection {
  sectionId: string;
  courseId: string;
  completedAt?: string;
}

export interface CourseProgress {
  courseId: string;
  completedSections: number;
  totalSections: number;
  percentage: number;
  isCompleted: boolean;
}
