import { Text, View } from "react-native";

interface BadgeProps {
  label: string;
  color?: string;
  backgroundColor?: string;
  size?: "sm" | "md";
}

export default function Badge({
  label,
  color = "#121D55",
  backgroundColor = "#EEF0FF",
  size = "sm",
}: BadgeProps) {
  const paddingH = size === "sm" ? 8 : 12;
  const paddingV = size === "sm" ? 3 : 5;
  const fontSize = size === "sm" ? 11 : 13;

  return (
    <View
      style={{
        backgroundColor,
        paddingHorizontal: paddingH,
        paddingVertical: paddingV,
        borderRadius: 20,
        alignSelf: "flex-start",
      }}
    >
      <Text
        style={{
          color,
          fontSize,
          fontFamily: "Manrope_600SemiBold",
        }}
      >
        {label}
      </Text>
    </View>
  );
}
