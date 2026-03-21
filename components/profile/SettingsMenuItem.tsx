import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface SettingsMenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sublabel?: string;
  onPress: () => void;
  iconColor?: string;
  iconBg?: string;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
  isDestructive?: boolean;
}

export default function SettingsMenuItem({
  icon,
  label,
  sublabel,
  onPress,
  iconColor = "#121D55",
  iconBg = "#EEF0FF",
  showChevron = true,
  rightElement,
  isDestructive = false,
}: SettingsMenuItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center px-5 py-4 border-b border-gray-50"
    >
      <View
        className="w-10 h-10 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: isDestructive ? "#FEF2F2" : iconBg }}
      >
        <Ionicons
          name={icon}
          size={20}
          color={isDestructive ? "#EF4444" : iconColor}
        />
      </View>

      <View className="flex-1">
        <Text
          className={`text-sm ${isDestructive ? "text-red-500" : "text-gray-900"}`}
          style={{ fontFamily: "Manrope_600SemiBold" }}
        >
          {label}
        </Text>
        {sublabel && (
          <Text
            className="text-xs text-gray-400 mt-0.5"
            style={{ fontFamily: "Manrope_400Regular" }}
          >
            {sublabel}
          </Text>
        )}
      </View>

      {rightElement ?? (
        showChevron && (
          <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
        )
      )}
    </TouchableOpacity>
  );
}
