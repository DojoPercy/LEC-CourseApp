import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";
import type { User } from "@/types/user";

interface ProfileHeaderProps {
  user: User;
  enrolledCount: number;
  completedCount: number;
}

export default function ProfileHeader({
  user,
  enrolledCount,
  completedCount,
}: ProfileHeaderProps) {
  return (
    <LinearGradient
      colors={["#121D55", "#1E2E7A"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="px-5 pt-6 pb-8"
    >
      {/* Avatar */}
      <View className="items-center mb-4">
        <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center border-2 border-white/40">
          <Text
            className="text-3xl text-white"
            style={{ fontFamily: "Manrope_700Bold" }}
          >
            {user.firstName[0]}
            {user.lastName[0]}
          </Text>
        </View>

        <Text
          className="text-xl text-white mt-3"
          style={{ fontFamily: "Manrope_700Bold" }}
        >
          {user.firstName} {user.lastName}
        </Text>
        <Text
          className="text-sm text-white/70 mt-0.5"
          style={{ fontFamily: "Manrope_400Regular" }}
        >
          {user.email}
        </Text>

        {user.megaCenter && (
          <View className="flex-row items-center gap-1 mt-2">
            <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.6)" />
            <Text
              className="text-xs text-white/60"
              style={{ fontFamily: "Manrope_400Regular" }}
            >
              {user.megaCenter}
            </Text>
          </View>
        )}
      </View>

      {/* Stats row */}
      <View className="flex-row justify-center gap-8">
        <View className="items-center">
          <Text
            className="text-2xl text-white"
            style={{ fontFamily: "Manrope_800ExtraBold" }}
          >
            {enrolledCount}
          </Text>
          <Text
            className="text-xs text-white/60 mt-0.5"
            style={{ fontFamily: "Manrope_400Regular" }}
          >
            Enrolled
          </Text>
        </View>
        <View className="w-px bg-white/20" />
        <View className="items-center">
          <Text
            className="text-2xl text-white"
            style={{ fontFamily: "Manrope_800ExtraBold" }}
          >
            {completedCount}
          </Text>
          <Text
            className="text-xs text-white/60 mt-0.5"
            style={{ fontFamily: "Manrope_400Regular" }}
          >
            Completed
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
