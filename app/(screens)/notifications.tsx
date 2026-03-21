import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PageHeader from "@/components/reusable/PageHeader";

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "New Course Available",
    message: "\"Cell Group Leadership\" is now available. Enroll today!",
    time: "2h ago",
    read: false,
    icon: "book" as const,
    iconBg: "#EEF0FF",
    iconColor: "#121D55",
  },
  {
    id: "2",
    title: "Lesson Reminder",
    message: "You haven't completed your lesson in \"Foundations of Faith\" yet.",
    time: "1d ago",
    read: false,
    icon: "alarm" as const,
    iconBg: "#FFFBEB",
    iconColor: "#F59E0B",
  },
  {
    id: "3",
    title: "Course Completed!",
    message: "Congratulations! You've completed \"The Power of Prayer\".",
    time: "3d ago",
    read: true,
    icon: "trophy" as const,
    iconBg: "#F0FDF4",
    iconColor: "#22C55E",
  },
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <View style={{ paddingTop: insets.top }}>
        <PageHeader title="Notifications" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        {MOCK_NOTIFICATIONS.map((notif) => (
          <TouchableOpacity
            key={notif.id}
            activeOpacity={0.7}
            className={`flex-row items-start px-5 py-4 border-b border-gray-50 ${
              !notif.read ? "bg-blue-50/50" : "bg-white"
            }`}
          >
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3 mt-0.5"
              style={{ backgroundColor: notif.iconBg }}
            >
              <Ionicons name={notif.icon} size={18} color={notif.iconColor} />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-0.5">
                <Text
                  className="text-sm text-gray-900"
                  style={{ fontFamily: "Manrope_700Bold" }}
                >
                  {notif.title}
                </Text>
                <Text
                  className="text-xs text-gray-400"
                  style={{ fontFamily: "Manrope_400Regular" }}
                >
                  {notif.time}
                </Text>
              </View>
              <Text
                className="text-sm text-gray-500 leading-5"
                style={{ fontFamily: "Manrope_400Regular" }}
              >
                {notif.message}
              </Text>
            </View>
            {!notif.read && (
              <View className="w-2 h-2 rounded-full bg-primary ml-2 mt-2" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
