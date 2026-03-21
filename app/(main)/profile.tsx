import { router } from "expo-router";
import { Alert, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CourseCard from "@/components/courses/CourseCard";
import ProfileHeader from "@/components/profile/ProfileHeader";
import SettingsMenuItem from "@/components/profile/SettingsMenuItem";
import EmptyState from "@/components/reusable/EmptyState";
import { MOCK_COURSES } from "@/data/mock-courses";
import { useAuthStore } from "@/stores/auth-store";
import { useProgressStore } from "@/stores/progress-store";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const { enrolledCourses, getCourseProgress, getCompletedCourseCount } = useProgressStore();

  if (!user) {
    router.replace("/welcome");
    return null;
  }

  const enrolledIds = enrolledCourses.map((e) => e.courseId);
  const completedCourseData = MOCK_COURSES.filter(
    (c) =>
      enrolledIds.includes(c.id) && getCourseProgress(c.id).isCompleted
  );

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/welcome");
        },
      },
    ]);
  };

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
        <ProfileHeader
          user={user}
          enrolledCount={enrolledIds.length}
          completedCount={getCompletedCourseCount()}
        />

        {/* Account Section */}
        <View className="mt-6 mb-4">
          <Text
            className="text-xs text-gray-400 uppercase tracking-wider px-5 mb-2"
            style={{ fontFamily: "Manrope_600SemiBold" }}
          >
            Account
          </Text>
          <View className="bg-white rounded-2xl mx-4 overflow-hidden border border-gray-100">
            <SettingsMenuItem
              icon="person-outline"
              label="Edit Profile"
              sublabel="Update your personal information"
              onPress={() => {}}
            />
            <SettingsMenuItem
              icon="school-outline"
              label="My Mega Center"
              sublabel={user.megaCenter ?? "Not set"}
              onPress={() => {}}
            />
            <SettingsMenuItem
              icon="notifications-outline"
              label="Notifications"
              sublabel="Manage your notification preferences"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Learning Section */}
        <View className="mb-4">
          <Text
            className="text-xs text-gray-400 uppercase tracking-wider px-5 mb-2"
            style={{ fontFamily: "Manrope_600SemiBold" }}
          >
            Learning
          </Text>
          <View className="bg-white rounded-2xl mx-4 overflow-hidden border border-gray-100">
            <SettingsMenuItem
              icon="book-outline"
              label="My Enrolled Courses"
              sublabel={`${enrolledIds.length} course${enrolledIds.length !== 1 ? "s" : ""} enrolled`}
              onPress={() => router.push("/(main)/courses")}
            />
            <SettingsMenuItem
              icon="trophy-outline"
              label="Completed Courses"
              sublabel={`${getCompletedCourseCount()} completed`}
              onPress={() => {}}
            />
            <SettingsMenuItem
              icon="stats-chart-outline"
              label="Learning Progress"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Completed courses */}
        {completedCourseData.length > 0 && (
          <View className="mb-6">
            <Text
              className="text-xs text-gray-400 uppercase tracking-wider px-5 mb-3"
              style={{ fontFamily: "Manrope_600SemiBold" }}
            >
              Completed Courses
            </Text>
            <View className="px-4">
              {completedCourseData.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isEnrolled
                  progress={100}
                  variant="enrolled"
                />
              ))}
            </View>
          </View>
        )}

        {/* Sign Out */}
        <View className="mb-4">
          <Text
            className="text-xs text-gray-400 uppercase tracking-wider px-5 mb-2"
            style={{ fontFamily: "Manrope_600SemiBold" }}
          >
            More
          </Text>
          <View className="bg-white rounded-2xl mx-4 overflow-hidden border border-gray-100">
            <SettingsMenuItem
              icon="help-circle-outline"
              label="Help & Support"
              onPress={() => {}}
            />
            <SettingsMenuItem
              icon="information-circle-outline"
              label="About LEC Course"
              onPress={() => {}}
            />
            <SettingsMenuItem
              icon="log-out-outline"
              label="Sign Out"
              onPress={handleLogout}
              isDestructive
              showChevron={false}
            />
          </View>
        </View>

        <Text
          className="text-xs text-gray-300 text-center pb-4"
          style={{ fontFamily: "Manrope_400Regular" }}
        >
          LEC Course App v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}
