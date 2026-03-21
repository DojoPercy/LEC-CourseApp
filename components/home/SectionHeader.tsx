import { Text, TouchableOpacity, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function SectionHeader({
  title,
  actionLabel,
  onAction,
}: SectionHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-5 mb-3">
      <Text
        className="text-base text-gray-900"
        style={{ fontFamily: "Manrope_700Bold" }}
      >
        {title}
      </Text>
      {actionLabel && onAction && (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text
            className="text-sm text-accent"
            style={{ fontFamily: "Manrope_600SemiBold" }}
          >
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
