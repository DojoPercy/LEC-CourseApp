import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

export default function PageHeader({ title, onBack, rightElement }: PageHeaderProps) {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <TouchableOpacity
        onPress={handleBack}
        className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={20} color="#121D55" />
      </TouchableOpacity>

      <Text
        className="text-lg text-primary"
        style={{ fontFamily: "Manrope_700Bold", flex: 1, textAlign: "center" }}
      >
        {title}
      </Text>

      <View className="w-10 h-10 items-center justify-center">
        {rightElement ?? null}
      </View>
    </View>
  );
}
