import type { Course } from "@/types/course";

export const MOCK_COURSES: Course[] = [
  {
    id: "course-1",
    title: "Welcome to God's Family",
    description:
      "A foundational course for new believers and anyone wanting to understand what it means to be part of God's family. You'll discover your identity in Christ, what salvation really means, and how to grow in your new life of faith.",
    imageUrl:
      "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&q=80",
    sectionsCount: 6,
    sections: [
      { id: "s1-1", courseId: "course-1", title: "You Belong to God", duration: "18:24", sortOrder: 1 },
      { id: "s1-2", courseId: "course-1", title: "What Happened When You Were Born Again", duration: "21:10", sortOrder: 2 },
      { id: "s1-3", courseId: "course-1", title: "Your New Nature", duration: "19:45", sortOrder: 3 },
      { id: "s1-4", courseId: "course-1", title: "The Holy Spirit in Your Life", duration: "17:30", sortOrder: 4 },
      { id: "s1-5", courseId: "course-1", title: "Prayer — Talking with Your Father", duration: "16:55", sortOrder: 5 },
      { id: "s1-6", courseId: "course-1", title: "Living as God's Child", duration: "21:16", sortOrder: 6 },
    ],
  },
  {
    id: "course-2",
    title: "Vocabulary of Salvation",
    description:
      "Salvation is more than a moment — it's a rich theological reality. This course unpacks the key terms and concepts surrounding salvation so you can know exactly what God has done for you and stand firm in that truth.",
    imageUrl:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80",
    sectionsCount: 7,
    sections: [
      { id: "s2-1", courseId: "course-2", title: "What Is Salvation?", duration: "20:05", sortOrder: 1 },
      { id: "s2-2", courseId: "course-2", title: "Redemption", duration: "18:40", sortOrder: 2 },
      { id: "s2-3", courseId: "course-2", title: "Justification", duration: "22:15", sortOrder: 3 },
      { id: "s2-4", courseId: "course-2", title: "Sanctification", duration: "19:30", sortOrder: 4 },
      { id: "s2-5", courseId: "course-2", title: "Propitiation & Atonement", duration: "21:00", sortOrder: 5 },
      { id: "s2-6", courseId: "course-2", title: "Reconciliation", duration: "17:50", sortOrder: 6 },
      { id: "s2-7", courseId: "course-2", title: "Glorification — Our Final Hope", duration: "20:40", sortOrder: 7 },
    ],
  },
];
