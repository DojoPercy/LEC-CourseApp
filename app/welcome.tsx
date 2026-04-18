import { router } from "expo-router";
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      source={require("../assets/welcomeScreenPic.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(10, 16, 53, 0.75)",
          paddingTop: insets.top,
          paddingBottom: insets.bottom + 36,
        }}
      >
        {/* Logo + branding — centered in upper portion */}
        <View className="flex-1 items-center justify-center gap-5">
          <View className="w-28 h-28 rounded-3xl bg-white/10 items-center justify-center border border-white/20">
            <Image
              source={require("../assets/LE_Logo.png")}
              style={{ width: 76, height: 76 }}
              resizeMode="contain"
            />
          </View>

          <View className="items-center gap-2">
            <Text
              className="text-white text-4xl text-center"
              style={{ fontFamily: "Manrope_800ExtraBold", letterSpacing: -0.5 }}
            >
              LEC Course
            </Text>
            <Text
              className="text-white/65 text-sm text-center leading-6 px-12"
              style={{ fontFamily: "Manrope_400Regular" }}
            >
              Grow in faith. Lead with purpose.
            </Text>
          </View>
        </View>

        {/* CTA buttons */}
        <View className="px-6 gap-3">
          <TouchableOpacity
            onPress={() => router.push("/(auth)/signup")}
            className="bg-white rounded-2xl py-4 items-center"
            activeOpacity={0.85}
          >
            <Text
              className="text-primary text-base"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              Get Started
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
        </View>
      </View>
    </ImageBackground>
  );
}
