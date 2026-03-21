import { Ionicons } from "@expo/vector-icons";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search courses...",
  onClear,
}: SearchBarProps) {
  return (
    <View className="flex-row items-center bg-gray-100 rounded-xl px-3 py-2.5 mx-5 mb-4">
      <Ionicons name="search-outline" size={18} color="#9CA3AF" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        className="flex-1 text-sm text-gray-900 ml-2"
        style={{ fontFamily: "Manrope_400Regular" }}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear ?? (() => onChangeText(""))} activeOpacity={0.7}>
          <Ionicons name="close-circle" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  );
}

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export function FilterChip({ label, isSelected, onPress }: FilterChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`px-4 py-2 rounded-full mr-2 border ${
        isSelected
          ? "bg-primary border-primary"
          : "bg-white border-gray-200"
      }`}
    >
      <Text
        className={`text-xs ${isSelected ? "text-white" : "text-gray-600"}`}
        style={{
          fontFamily: isSelected ? "Manrope_600SemiBold" : "Manrope_500Medium",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
