import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface StatItem {
  label: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
}

interface StatsRowProps {
  enrolledCount: number;
  completedCount: number;
  lessonsCompleted: number;
}

export default function StatsRow({
  enrolledCount,
  completedCount,
  lessonsCompleted,
}: StatsRowProps) {
  const stats: StatItem[] = [
    {
      label: "Enrolled",
      value: enrolledCount,
      icon: "book",
      iconColor: "#121D55",
      iconBg: "#EEF0FF",
    },
    {
      label: "Completed",
      value: completedCount,
      icon: "trophy",
      iconColor: "#F59E0B",
      iconBg: "#FFFBEB",
    },
    {
      label: "Lessons",
      value: lessonsCompleted,
      icon: "checkmark-circle",
      iconColor: "#22C55E",
      iconBg: "#F0FDF4",
    },
  ];

  return (
    <View className="flex-row gap-3 px-5 mb-6">
      {stats.map((stat) => (
        <View
          key={stat.label}
          className="flex-1 bg-white rounded-2xl p-3 shadow-sm border border-gray-100 items-center"
        >
          <View
            className="w-10 h-10 rounded-full items-center justify-center mb-2"
            style={{ backgroundColor: stat.iconBg }}
          >
            <Ionicons name={stat.icon} size={18} color={stat.iconColor} />
          </View>
          <Text
            className="text-xl text-gray-900"
            style={{ fontFamily: "Manrope_800ExtraBold" }}
          >
            {stat.value}
          </Text>
          <Text
            className="text-xs text-gray-500 mt-0.5"
            style={{ fontFamily: "Manrope_400Regular" }}
          >
            {stat.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
