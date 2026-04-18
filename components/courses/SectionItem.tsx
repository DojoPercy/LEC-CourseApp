import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import type { Section } from "@/types/course";

interface SectionItemProps {
  section: Section;
  isCompleted: boolean;
  isActive?: boolean;
  isLocked?: boolean;
  downloadStatus?: "idle" | "downloading" | "downloaded" | "error";
  downloadProgress?: number;
  onPress: (section: Section) => void;
}

export default function SectionItem({
  section,
  isCompleted,
  isActive = false,
  isLocked = false,
  downloadStatus = "idle",
  downloadProgress = 0,
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
          : isLocked
          ? "bg-gray-50 border-gray-100"
          : "bg-white border-gray-100"
      }`}
    >
      {/* Status icon */}
      <View
        className={`w-9 h-9 rounded-full items-center justify-center mr-3 ${
          isActive ? "bg-white/20" : isCompleted ? "bg-green-100" : isLocked ? "bg-gray-100" : "bg-blue-50"
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
          className={`text-sm mb-0.5 ${isLocked ? "text-gray-400" : isActive ? "text-white" : "text-gray-900"}`}
          style={{ fontFamily: "Manrope_600SemiBold" }}
          numberOfLines={2}
        >
          {section.title}
        </Text>

        <View className="flex-row items-center gap-2 flex-wrap mt-0.5">
          {/* Lock message */}
          {isLocked && (
            <Text className="text-xs text-gray-400" style={{ fontFamily: "Manrope_400Regular" }}>
              Complete previous lesson to unlock
            </Text>
          )}

          {/* Duration (only when unlocked) */}
          {!isLocked && section.duration && (
            <View className="flex-row items-center gap-1">
              <Ionicons name="time-outline" size={11} color={isActive ? "rgba(255,255,255,0.7)" : "#9CA3AF"} />
              <Text
                className={`text-xs ${isActive ? "text-white/70" : "text-gray-400"}`}
                style={{ fontFamily: "Manrope_400Regular" }}
              >
                {section.duration}
              </Text>
            </View>
          )}

          {/* Downloaded badge — shown even when locked */}
          {downloadStatus === "downloaded" && (
            <View className={`flex-row items-center gap-0.5 px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-green-100"}`}>
              <Ionicons name="checkmark-circle" size={10} color={isActive ? "white" : "#16A34A"} />
              <Text
                className={`text-xs ${isActive ? "text-white/90" : "text-green-700"}`}
                style={{ fontFamily: "Manrope_600SemiBold" }}
              >
                Downloaded
              </Text>
            </View>
          )}

          {/* Downloading badge — shown even when locked */}
          {downloadStatus === "downloading" && (
            <View className={`flex-row items-center gap-1 px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20" : "bg-blue-50"}`}>
              <ActivityIndicator size={9} color={isActive ? "white" : "#3B82F6"} />
              <Text
                className={`text-xs ${isActive ? "text-white/90" : "text-blue-600"}`}
                style={{ fontFamily: "Manrope_600SemiBold" }}
              >
                {Math.round(downloadProgress * 100)}%
              </Text>
            </View>
          )}

          {/* Error badge — shown even when locked */}
          {downloadStatus === "error" && (
            <View className="flex-row items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-red-50">
              <Ionicons name="alert-circle" size={10} color="#DC2626" />
              <Text className="text-xs text-red-600" style={{ fontFamily: "Manrope_600SemiBold" }}>
                Failed
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Lesson number */}
      <Text
        className={`text-xs ml-2 ${isActive ? "text-white/60" : "text-gray-300"}`}
        style={{ fontFamily: "Manrope_500Medium" }}
      >
        {String(section.sortOrder).padStart(2, "0")}
      </Text>
    </TouchableOpacity>
  );
}
