import { useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CourseCard from "@/components/courses/CourseCard";
import SearchBar from "@/components/courses/SearchBar";
import EmptyState from "@/components/reusable/EmptyState";
import LoadingSpinner from "@/components/reusable/LoadingSpinner";
import { useCoursesStore } from "@/stores/courses-store";
import { useProgressStore } from "@/stores/progress-store";

export default function CoursesScreen() {
  const insets = useSafeAreaInsets();
  const {
    fetchCourses,
    isLoading,
    searchQuery,
    setSearchQuery,
    getFilteredCourses,
    clearFilters,
  } = useCoursesStore();

  const { isEnrolled, getCourseProgress } = useProgressStore();

  useEffect(() => {
    fetchCourses();
  }, []);

  const filtered = getFilteredCourses();

  return (
    <View className="flex-1 bg-surface">
      {/* Fixed Header */}
      <View
        style={{ paddingTop: insets.top + 12 }}
        className="bg-surface pb-2"
      >
        <View className="px-5 mb-4">
          <Text
            className="text-2xl text-primary"
            style={{ fontFamily: "Manrope_800ExtraBold" }}
          >
            Browse Courses
          </Text>
          <Text
            className="text-sm text-gray-500 mt-1"
            style={{ fontFamily: "Manrope_400Regular" }}
          >
            {filtered.length} course{filtered.length !== 1 ? "s" : ""} available
          </Text>
        </View>

        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by title or instructor..."
        />

      </View>

      {/* Course list */}
      {isLoading ? (
        <LoadingSpinner message="Loading courses..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No courses found"
          subtitle="Try adjusting your search or filters."
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: insets.bottom + 80,
            gap: 12,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <CourseCard
              course={item}
              isEnrolled={isEnrolled(item.id)}
              progress={isEnrolled(item.id) ? getCourseProgress(item.id).percentage : 0}
              variant="list"
            />
          )}
        />
      )}
    </View>
  );
}
