import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import ProgressBar from "@/components/reusable/ProgressBar";
import type { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
  progress?: number; // 0-100
  variant?: "grid" | "list" | "enrolled";
}

export default function CourseCard({
  course,
  isEnrolled = false,
  progress = 0,
  variant = "grid",
}: CourseCardProps) {
  const handlePress = () => {
    router.push({
      pathname: "/(screens)/course-detail",
      params: { courseId: course.id },
    });
  };

  const lessonCount = course.sectionsCount ?? course.sections?.length ?? 0;

  if (variant === "enrolled") {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-3"
      >
        <View className="flex-row">
          <Image
            source={{ uri: course.imageUrl ?? undefined }}
            style={{ width: 100, height: 100 }}
            contentFit="cover"
          />
          <View className="flex-1 p-3 justify-between">
            <Text
              className="text-sm text-gray-900 mb-1"
              style={{ fontFamily: "Manrope_700Bold" }}
              numberOfLines={2}
            >
              {course.title}
            </Text>

            <View>
              <View className="flex-row items-center justify-between mb-1">
                <Text
                  className="text-xs text-primary"
                  style={{ fontFamily: "Manrope_600SemiBold" }}
                >
                  {progress}% complete
                </Text>
                <Text
                  className="text-xs text-gray-400"
                  style={{ fontFamily: "Manrope_400Regular" }}
                >
                  {lessonCount} lessons
                </Text>
              </View>
              <ProgressBar percentage={progress} height={5} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (variant === "list") {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-3"
      >
        <View className="flex-row">
          <Image
            source={{ uri: course.imageUrl ?? undefined }}
            style={{ width: 110, height: 110 }}
            contentFit="cover"
          />
          <View className="flex-1 p-3">
            <Text
              className="text-sm text-gray-900 mb-2"
              style={{ fontFamily: "Manrope_700Bold" }}
              numberOfLines={2}
            >
              {course.title}
            </Text>
            {course.description ? (
              <Text
                className="text-xs text-gray-500 mb-2"
                style={{ fontFamily: "Manrope_400Regular" }}
                numberOfLines={2}
              >
                {course.description}
              </Text>
            ) : null}
            <View className="flex-row items-center gap-3">
              <View className="flex-row items-center gap-1">
                <Ionicons name="play-circle-outline" size={12} color="#9CA3AF" />
                <Text
                  className="text-xs text-gray-400"
                  style={{ fontFamily: "Manrope_400Regular" }}
                >
                  {lessonCount} lessons
                </Text>
              </View>
              {isEnrolled && (
                <View className="flex-row items-center gap-1">
                  <Ionicons name="checkmark-circle" size={12} color="#22C55E" />
                  <Text
                    className="text-xs text-green-500"
                    style={{ fontFamily: "Manrope_600SemiBold" }}
                  >
                    Enrolled
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Default: grid variant
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
      style={{ flex: 1 }}
    >
      <View className="relative">
        <Image
          source={{ uri: course.imageUrl ?? undefined }}
          style={{ width: "100%", height: 130 }}
          contentFit="cover"
        />
        {isEnrolled && (
          <View className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
            <Ionicons name="checkmark" size={10} color="white" />
          </View>
        )}
      </View>

      <View className="p-3">
        <Text
          className="text-sm text-gray-900 mb-1"
          style={{ fontFamily: "Manrope_700Bold" }}
          numberOfLines={2}
        >
          {course.title}
        </Text>
        <View className="flex-row items-center gap-2 mt-1">
          <Ionicons name="play-circle-outline" size={12} color="#9CA3AF" />
          <Text
            className="text-xs text-gray-400"
            style={{ fontFamily: "Manrope_400Regular" }}
          >
            {lessonCount} lessons
          </Text>
        </View>

        {isEnrolled && progress > 0 && (
          <View className="mt-2">
            <ProgressBar percentage={progress} height={4} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
