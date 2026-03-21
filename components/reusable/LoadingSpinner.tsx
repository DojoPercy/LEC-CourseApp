import { ActivityIndicator, Text, View } from "react-native";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "large";
  color?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  message,
  size = "large",
  color = "#121D55",
  fullScreen = false,
}: LoadingSpinnerProps) {
  return (
    <View
      className={
        fullScreen
          ? "flex-1 items-center justify-center bg-white"
          : "items-center justify-center py-12"
      }
    >
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text
          className="text-gray-500 mt-3 text-sm"
          style={{ fontFamily: "Manrope_400Regular" }}
        >
          {message}
        </Text>
      )}
    </View>
  );
}
