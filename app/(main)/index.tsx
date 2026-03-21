import { router } from "expo-router";
import { useEffect } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CourseCard from "@/components/courses/CourseCard";
import HomeHeader from "@/components/home/HomeHeader";
import SectionHeader from "@/components/home/SectionHeader";
import StatsRow from "@/components/home/StatsRow";
import EmptyState from "@/components/reusable/EmptyState";
import { useAuthStore } from "@/stores/auth-store";
import { useCoursesStore } from "@/stores/courses-store";
import { useProgressStore } from "@/stores/progress-store";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const { courses, fetchCourses } = useCoursesStore();
  const {
    enrolledCourses,
    getCourseProgress,
    getCompletedCourseCount,
    getTotalLessonsCompleted,
  } = useProgressStore();

  useEffect(() => {
    if (courses.length === 0) fetchCourses();
  }, []);

  const enrolledIds = enrolledCourses.map((e) => e.courseId);
  const enrolledCourseData = courses.filter((c) => enrolledIds.includes(c.id));
  const continueCoursesData = enrolledCourseData.filter(
    (c) => getCourseProgress(c.id).percentage > 0 && !getCourseProgress(c.id).isCompleted
  );
  const suggestedCourses = courses.filter(
    (c) => !enrolledIds.includes(c.id)
  ).slice(0, 4);

  return (
    <View className="flex-1 bg-surface">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 80,
        }}
      >
        {/* Header */}
        <HomeHeader user={user} />

        {/* Stats */}
        <StatsRow
          enrolledCount={enrolledIds.length}
          completedCount={getCompletedCourseCount()}
          lessonsCompleted={getTotalLessonsCompleted()}
        />

        {/* Continue Learning */}
        {continueCoursesData.length > 0 && (
          <View className="mb-6">
            <SectionHeader
              title="Continue Learning"
              actionLabel="See All"
              onAction={() => router.push("/(main)/courses")}
            />
            <View className="px-5">
              {continueCoursesData.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isEnrolled
                  progress={getCourseProgress(course.id).percentage}
                  variant="enrolled"
                />
              ))}
            </View>
          </View>
        )}

        {/* My Courses */}
        {enrolledCourseData.length > 0 && (
          <View className="mb-6">
            <SectionHeader
              title="My Courses"
              actionLabel="See All"
              onAction={() => router.push("/(main)/courses")}
            />
            <FlatList
              horizontal
              data={enrolledCourseData}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={{ width: 200 }}>
                  <CourseCard
                    course={item}
                    isEnrolled
                    progress={getCourseProgress(item.id).percentage}
                    variant="grid"
                  />
                </View>
              )}
            />
          </View>
        )}

        {/* Suggested Courses */}
        <View className="mb-6">
          <SectionHeader
            title={enrolledIds.length === 0 ? "Start Learning" : "Explore More"}
            actionLabel="Browse All"
            onAction={() => router.push("/(main)/courses")}
          />
          {enrolledIds.length === 0 && (
            <View className="mx-5 mb-4 bg-blue-50 rounded-2xl px-4 py-4 flex-row items-center gap-3">
              <Text className="text-2xl">👋</Text>
              <View className="flex-1">
                <Text
                  className="text-sm text-primary"
                  style={{ fontFamily: "Manrope_700Bold" }}
                >
                  Welcome to LEC Course!
                </Text>
                <Text
                  className="text-xs text-gray-500 mt-0.5"
                  style={{ fontFamily: "Manrope_400Regular" }}
                >
                  Enroll in a course below to get started.
                </Text>
              </View>
            </View>
          )}
          <View className="px-5 gap-3">
            {suggestedCourses.length > 0 ? (
              <View className="flex-row flex-wrap gap-3">
                {suggestedCourses.map((course) => (
                  <View key={course.id} style={{ width: "47.5%" }}>
                    <CourseCard course={course} variant="grid" />
                  </View>
                ))}
              </View>
            ) : (
              <EmptyState
                icon="trophy"
                title="All Caught Up!"
                subtitle="You've enrolled in all available courses. Great work!"
              />
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
