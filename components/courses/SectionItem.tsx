import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import type { Section } from "@/types/course";

interface SectionItemProps {
  section: Section;
  isCompleted: boolean;
  isActive?: boolean;
  isLocked?: boolean;
  onPress: (section: Section) => void;
}

export default function SectionItem({
  section,
  isCompleted,
  isActive = false,
  isLocked = false,
  onPress,
}: SectionItemProps) {
  return (
    <TouchableOpacity
      onPress={() => !isLocked && onPress(section)}
      activeOpacity={isLocked ? 1 : 0.7}
      className={`flex-row items-center p-4 rounded-xl mb-2 border ${
        isActive
          ? "bg-primary border-primary"
          : isCompleted
          ? "bg-green-50 border-green-100"
          : "bg-white border-gray-100"
      }`}
    >
      {/* Status icon */}
      <View
        className={`w-9 h-9 rounded-full items-center justify-center mr-3 ${
          isActive
            ? "bg-white/20"
            : isCompleted
            ? "bg-green-100"
            : isLocked
            ? "bg-gray-100"
            : "bg-blue-50"
        }`}
      >
        {isLocked ? (
          <Ionicons name="lock-closed" size={16} color="#9CA3AF" />
        ) : isCompleted ? (
          <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
        ) : isActive ? (
          <Ionicons name="play" size={16} color="#FFFFFF" />
        ) : (
          <Ionicons name="play-outline" size={16} color="#121D55" />
        )}
      </View>

      {/* Section info */}
      <View className="flex-1">
        <Text
          className={`text-sm mb-0.5 ${
            isActive ? "text-white" : "text-gray-900"
          }`}
          style={{ fontFamily: "Manrope_600SemiBold" }}
          numberOfLines={2}
        >
          {section.title}
        </Text>
        {section.duration ? (
          <View className="flex-row items-center gap-1">
            <Ionicons
              name="time-outline"
              size={11}
              color={isActive ? "rgba(255,255,255,0.7)" : "#9CA3AF"}
            />
            <Text
              className={`text-xs ${
                isActive ? "text-white/70" : "text-gray-400"
              }`}
              style={{ fontFamily: "Manrope_400Regular" }}
            >
              {section.duration}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Lesson number */}
      <Text
        className={`text-xs ml-2 ${
          isActive ? "text-white/60" : "text-gray-300"
        }`}
        style={{ fontFamily: "Manrope_500Medium" }}
      >
        {String(section.sortOrder).padStart(2, "0")}
      </Text>
    </TouchableOpacity>
  );
}
