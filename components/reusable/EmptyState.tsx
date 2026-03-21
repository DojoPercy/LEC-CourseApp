import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon = "book-outline",
  title,
  subtitle,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View className="w-20 h-20 rounded-full bg-blue-50 items-center justify-center mb-4">
        <Ionicons name={icon} size={40} color="#121D55" />
      </View>

      <Text
        className="text-xl text-gray-900 text-center mb-2"
        style={{ fontFamily: "Manrope_700Bold" }}
      >
        {title}
      </Text>

      {subtitle && (
        <Text
          className="text-sm text-gray-500 text-center mb-6 leading-5"
          style={{ fontFamily: "Manrope_400Regular" }}
        >
          {subtitle}
        </Text>
      )}

      {actionLabel && onAction && (
        <TouchableOpacity
          onPress={onAction}
          className="bg-primary px-6 py-3 rounded-xl"
          activeOpacity={0.85}
        >
          <Text
            className="text-white text-sm"
            style={{ fontFamily: "Manrope_600SemiBold" }}
          >
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
