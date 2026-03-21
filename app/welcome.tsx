import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FEATURES = [
  {
    icon: "play-circle" as const,
    title: "Video Lessons",
    desc: "Watch high-quality teaching videos at your own pace",
  },
  {
    icon: "trophy" as const,
    title: "Track Progress",
    desc: "See how far you've come with detailed progress tracking",
  },
  {
    icon: "people" as const,
    title: "Kingdom Impact",
    desc: "Content designed to grow you in faith and leadership",
  },
];

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* Hero Section */}
        <LinearGradient
          colors={["#121D55", "#1E2E7A", "#2A3D9A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingTop: insets.top + 24, paddingBottom: 60 }}
          className="px-6"
        >
          {/* Logo area */}
          <View className="flex-row items-center gap-2 mb-10">
            <View className="w-10 h-10 rounded-xl bg-white/20 items-center justify-center">
              <Ionicons name="school" size={22} color="white" />
            </View>
            <Text
              className="text-white text-lg"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              LEC Course
            </Text>
          </View>

          {/* Headline */}
          <Text
            className="text-white text-4xl leading-tight mb-4"
            style={{ fontFamily: "Manrope_800ExtraBold" }}
          >
            Grow In Faith.{"\n"}Lead With Purpose.
          </Text>
          <Text
            className="text-white/70 text-base leading-6 mb-8"
            style={{ fontFamily: "Manrope_400Regular" }}
          >
            Access world-class biblical teaching, leadership training, and discipleship
            content — all in one place.
          </Text>

          {/* CTA Buttons */}
          <TouchableOpacity
            onPress={() => router.push("/(auth)/signup")}
            className="bg-white rounded-2xl py-4 items-center mb-3"
            activeOpacity={0.85}
          >
            <Text
              className="text-primary text-base"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              Get Started — It's Free
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/login")}
            className="border border-white/30 rounded-2xl py-4 items-center"
            activeOpacity={0.85}
          >
            <Text
              className="text-white text-base"
              style={{ fontFamily: "Manrope_600SemiBold" }}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Features */}
        <View className="px-6 py-8">
          <Text
            className="text-2xl text-gray-900 mb-6"
            style={{ fontFamily: "Manrope_800ExtraBold" }}
          >
            Why LEC Course?
          </Text>

          {FEATURES.map((feature, i) => (
            <View key={i} className="flex-row items-start gap-4 mb-6">
              <View className="w-12 h-12 rounded-2xl bg-blue-50 items-center justify-center">
                <Ionicons name={feature.icon} size={24} color="#121D55" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-base text-gray-900 mb-1"
                  style={{ fontFamily: "Manrope_700Bold" }}
                >
                  {feature.title}
                </Text>
                <Text
                  className="text-sm text-gray-500 leading-5"
                  style={{ fontFamily: "Manrope_400Regular" }}
                >
                  {feature.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Course count banner */}
        <View className="mx-6 mb-8 bg-primary rounded-2xl px-5 py-5 flex-row items-center gap-4">
          <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
            <Ionicons name="book" size={24} color="white" />
          </View>
          <View className="flex-1">
            <Text
              className="text-white text-xl"
              style={{ fontFamily: "Manrope_800ExtraBold" }}
            >
              6 Courses Available
            </Text>
            <Text
              className="text-white/70 text-sm"
              style={{ fontFamily: "Manrope_400Regular" }}
            >
              Foundations, Leadership, Prayer & more
            </Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="rgba(255,255,255,0.6)" />
        </View>

        {/* Footer */}
        <View
          className="items-center pb-8"
          style={{ paddingBottom: insets.bottom + 24 }}
        >
          <Text
            className="text-xs text-gray-400"
            style={{ fontFamily: "Manrope_400Regular" }}
          >
            Love Encounter Church — All Rights Reserved
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
