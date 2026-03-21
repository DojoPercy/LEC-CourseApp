import { View } from "react-native";

interface ProgressBarProps {
  percentage: number; // 0-100
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
  className?: string;
}

export default function ProgressBar({
  percentage,
  height = 6,
  backgroundColor = "#E5E7EB",
  fillColor = "#121D55",
  className,
}: ProgressBarProps) {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <View
      className={className}
      style={{
        height,
        backgroundColor,
        borderRadius: height / 2,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          height,
          width: `${clampedPercentage}%`,
          backgroundColor: fillColor,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
}
