import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import type { User } from "@/types/user";

interface HomeHeaderProps {
  user: User | null;
}

export default function HomeHeader({ user }: HomeHeaderProps) {
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <View className="flex-row items-center justify-between px-5 py-4">
      <View className="flex-1">
        <Text
          className="text-xs text-gray-500 mb-0.5"
          style={{ fontFamily: "Manrope_400Regular" }}
        >
          {greeting()},
        </Text>
        <Text
          className="text-xl text-primary"
          style={{ fontFamily: "Manrope_800ExtraBold" }}
        >
          {user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Welcome back" : "Welcome back"}
        </Text>
      </View>

      <View className="flex-row items-center gap-3">
        <TouchableOpacity
          onPress={() => router.push("/(screens)/notifications")}
          className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center relative"
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={20} color="#121D55" />
          {/* Notification dot */}
          <View className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(main)/profile")}
          activeOpacity={0.8}
        >
          {user?.profilePicture ? (
            <Image
              source={{ uri: user.profilePicture }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
              contentFit="cover"
            />
          ) : (
            <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
              <Text
                className="text-white text-sm"
                style={{ fontFamily: "Manrope_700Bold" }}
              >
                {user
                  ? `${(user.firstName ?? "U")[0]}${(user.lastName ?? "")[0]}`
                  : "U"}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
