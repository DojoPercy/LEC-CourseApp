import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import SectionItem from "@/components/courses/SectionItem";
import VideoPlayer from "@/components/courses/VideoPlayer";
import ProgressBar from "@/components/reusable/ProgressBar";
import { useCoursesStore } from "@/stores/courses-store";
import { useProgressStore } from "@/stores/progress-store";
import type { Section } from "@/types/course";

export default function CourseDetailScreen() {
  const insets = useSafeAreaInsets();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();

  const getCourseById = useCoursesStore((state) => state.getCourseById);
  const {
    isEnrolled,
    enrollInCourse,
    unenrollFromCourse,
    isSectionCompleted,
    markSectionComplete,
    setLastAccessedSection,
    getCourseProgress,
    syncProgressFromApi,
  } = useProgressStore();

  const course = getCourseById(courseId ?? "");

  // Start on first incomplete section if enrolled, otherwise first section
  const getInitialSection = (): Section | null => {
    if (!course) return null;
    const enrolled = isEnrolled(course.id);
    if (enrolled) {
      const firstIncomplete = course.sections.find((s) => !isSectionCompleted(s.id));
      return firstIncomplete ?? course.sections[0];
    }
    return course.sections[0] ?? null;
  };

  const [activeSection, setActiveSection] = useState<Section | null>(getInitialSection);
  const [isPlaying, setIsPlaying] = useState(false);

  // Sync real progress from API when the screen mounts (if enrolled)
  useEffect(() => {
    if (course && isEnrolled(course.id)) {
      syncProgressFromApi(course.id);
    }
  }, [course?.id]);

  if (!course) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500" style={{ fontFamily: "Manrope_400Regular" }}>
          Course not found
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-primary" style={{ fontFamily: "Manrope_600SemiBold" }}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const enrolled = isEnrolled(course.id);
  const progress = getCourseProgress(course.id);

  const handleSectionPress = (section: Section) => {
    if (!enrolled) {
      Toast.show({
        type: "info",
        text1: "Enroll to watch lessons",
        text2: "Tap 'Enroll Now' below to get started.",
      });
      return;
    }
    setActiveSection(section);
    setLastAccessedSection(course.id, section.id);
    setIsPlaying(true);
  };

  const handleEnroll = () => {
    enrollInCourse(course.id);
    setIsPlaying(true);
    Toast.show({
      type: "success",
      text1: "Enrolled!",
      text2: `You've joined "${course.title}". First lesson is starting.`,
    });
  };

  /** Called automatically when the video finishes playing */
  const handleVideoEnd = () => {
    if (!activeSection || isSectionCompleted(activeSection.id)) return;

    markSectionComplete(activeSection.id, course.id);

    const currentIndex = course.sections.findIndex((s) => s.id === activeSection.id);
    const isLastSection = currentIndex === course.sections.length - 1;

    if (isLastSection) {
      Toast.show({
        type: "success",
        text1: "Course Complete!",
        text2: "Congratulations! You've finished this course.",
        visibilityTime: 4000,
      });
    } else {
      setTimeout(() => {
        const nextSection = course.sections[currentIndex + 1];
        setActiveSection(nextSection);
        setLastAccessedSection(course.id, nextSection.id);
        setIsPlaying(true);
      }, 1200);
    }
  };

  const handleUnenroll = () => {
    Alert.alert(
      "Unenroll from Course?",
      "Your progress will be lost. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unenroll",
          style: "destructive",
          onPress: () => {
            unenrollFromCourse(course.id);
            setIsPlaying(false);
            Toast.show({ type: "info", text1: "Unenrolled from course" });
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Video Player */}
      <VideoPlayer
        section={activeSection}
        isPlaying={isPlaying}
        onPlayToggle={() => setIsPlaying((v) => !v)}
        onVideoEnd={handleVideoEnd}
      />

      {/* Back button overlay */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute left-4 w-9 h-9 rounded-full bg-black/40 items-center justify-center"
        style={{ top: insets.top + 8 }}
        activeOpacity={0.8}
      >
        <Ionicons name="arrow-back" size={18} color="white" />
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {/* Course Info */}
        <View className="px-5 pt-5 pb-4">
          <Text
            className="text-xl text-gray-900 mb-1"
            style={{ fontFamily: "Manrope_800ExtraBold" }}
          >
            {course.title}
          </Text>

          <View className="flex-row items-center gap-4 mb-4">
            <View className="flex-row items-center gap-1">
              <Ionicons name="play-circle-outline" size={14} color="#9CA3AF" />
              <Text className="text-xs text-gray-400" style={{ fontFamily: "Manrope_400Regular" }}>
                {course.sectionsCount ?? course.sections.length} lessons
              </Text>
            </View>
          </View>

          {course.description ? (
            <Text
              className="text-sm text-gray-600 leading-5"
              style={{ fontFamily: "Manrope_400Regular" }}
            >
              {course.description}
            </Text>
          ) : null}
        </View>

        {/* Course Complete Banner */}
        {enrolled && progress.isCompleted && (
          <View className="mx-5 bg-green-50 border border-green-100 rounded-2xl px-4 py-4 mb-4 flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center">
              <Ionicons name="trophy" size={20} color="#22C55E" />
            </View>
            <View className="flex-1">
              <Text
                className="text-sm text-green-800"
                style={{ fontFamily: "Manrope_700Bold" }}
              >
                Course Completed!
              </Text>
              <Text
                className="text-xs text-green-600 mt-0.5"
                style={{ fontFamily: "Manrope_400Regular" }}
              >
                You've finished all {course.sectionsCount ?? course.sections.length} lessons. Well done!
              </Text>
            </View>
          </View>
        )}

        {/* Progress (if enrolled and not complete) */}
        {enrolled && !progress.isCompleted && (
          <View className="mx-5 bg-blue-50 rounded-2xl px-4 py-4 mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text
                className="text-sm text-primary"
                style={{ fontFamily: "Manrope_700Bold" }}
              >
                Your Progress
              </Text>
              <Text
                className="text-sm text-primary"
                style={{ fontFamily: "Manrope_700Bold" }}
              >
                {progress.percentage}%
              </Text>
            </View>
            <ProgressBar percentage={progress.percentage} height={8} />
            <Text
              className="text-xs text-gray-500 mt-2"
              style={{ fontFamily: "Manrope_400Regular" }}
            >
              {progress.completedSections} of {progress.totalSections} lessons completed
            </Text>
          </View>
        )}

        {/* Enroll CTA (if not enrolled) */}
        {!enrolled && (
          <View className="px-5 mb-6">
            <TouchableOpacity
              onPress={handleEnroll}
              className="bg-primary rounded-2xl py-4 items-center"
              activeOpacity={0.85}
            >
              <Text
                className="text-white text-base"
                style={{ fontFamily: "Manrope_700Bold" }}
              >
                Enroll Now — It's Free
              </Text>
            </TouchableOpacity>
            <Text
              className="text-xs text-gray-400 text-center mt-2"
              style={{ fontFamily: "Manrope_400Regular" }}
            >
              Progress saves automatically as you watch each lesson
            </Text>
          </View>
        )}

        {/* Section List */}
        <View className="px-5">
          <Text
            className="text-base text-gray-900 mb-3"
            style={{ fontFamily: "Manrope_700Bold" }}
          >
            Course Content
          </Text>
          {course.sections.map((section, index) => (
            <SectionItem
              key={section.id}
              section={section}
              isCompleted={isSectionCompleted(section.id)}
              isActive={activeSection?.id === section.id}
              isLocked={!enrolled && index > 0}
              onPress={handleSectionPress}
            />
          ))}
        </View>

        {/* Unenroll link */}
        {enrolled && (
          <TouchableOpacity
            onPress={handleUnenroll}
            className="mt-6 items-center"
            activeOpacity={0.6}
          >
            <Text
              className="text-xs text-gray-400"
              style={{ fontFamily: "Manrope_500Medium" }}
            >
              Unenroll from this course
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
