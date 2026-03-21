import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Toast.show({ type: "error", text1: "Please fill in all fields" });
      return;
    }

    try {
      await login(email.trim(), password);
      router.replace("/(main)");
    } catch {
      Toast.show({ type: "error", text1: "Login failed", text2: "Please check your credentials." });
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
        }}
      >
        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="mx-5 w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-8"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#121D55" />
        </TouchableOpacity>

        {/* Header */}
        <View className="px-6 mb-8">
          <Text
            className="text-3xl text-primary mb-2"
            style={{ fontFamily: "Manrope_800ExtraBold" }}
          >
            Welcome back
          </Text>
          <Text
            className="text-base text-gray-500"
            style={{ fontFamily: "Manrope_400Regular" }}
          >
            Sign in to continue your learning journey
          </Text>
        </View>

        {/* Form */}
        <View className="px-6 gap-4">
          {/* Email */}
          <View>
            <Text
              className="text-sm text-gray-700 mb-2"
              style={{ fontFamily: "Manrope_600SemiBold" }}
            >
              Email Address
            </Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 gap-3">
              <Ionicons name="mail-outline" size={18} color="#9CA3AF" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                className="flex-1 text-sm text-gray-900"
                style={{ fontFamily: "Manrope_400Regular" }}
              />
            </View>
          </View>

          {/* Password */}
          <View>
            <Text
              className="text-sm text-gray-700 mb-2"
              style={{ fontFamily: "Manrope_600SemiBold" }}
            >
              Password
            </Text>
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 gap-3">
              <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                autoComplete="password"
                className="flex-1 text-sm text-gray-900"
                style={{ fontFamily: "Manrope_400Regular" }}
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot password */}
          <TouchableOpacity
            onPress={() => router.push("/(auth)/forgot-password")}
            className="self-end"
            activeOpacity={0.7}
          >
            <Text
              className="text-sm text-accent"
              style={{ fontFamily: "Manrope_600SemiBold" }}
            >
              Forgot password?
            </Text>
          </TouchableOpacity>

          {/* Login button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className={`bg-primary rounded-2xl py-4 items-center mt-2 ${
              isLoading ? "opacity-70" : ""
            }`}
            activeOpacity={0.85}
          >
            <Text
              className="text-white text-base"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View className="flex-row items-center px-6 my-6 gap-4">
          <View className="flex-1 h-px bg-gray-200" />
          <Text
            className="text-xs text-gray-400"
            style={{ fontFamily: "Manrope_400Regular" }}
          >
            OR
          </Text>
          <View className="flex-1 h-px bg-gray-200" />
        </View>

        {/* Sign up link */}
        <View className="flex-row items-center justify-center gap-1 px-6">
          <Text
            className="text-sm text-gray-500"
            style={{ fontFamily: "Manrope_400Regular" }}
          >
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/signup")} activeOpacity={0.7}>
            <Text
              className="text-sm text-primary"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
