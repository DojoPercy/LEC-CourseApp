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

type Step = "email" | "code" | "password" | "success";

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const { sendResetCode, verifyResetCode, resetPassword, isLoading } = useAuthStore();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendCode = async () => {
    if (!email.trim()) {
      Toast.show({ type: "error", text1: "Enter your email address" });
      return;
    }
    try {
      await sendResetCode(email.trim());
      setStep("code");
      Toast.show({ type: "success", text1: "Code sent!", text2: "Check your email." });
    } catch {
      Toast.show({ type: "error", text1: "Failed to send code" });
    }
  };

  const handleVerifyCode = async () => {
    if (code.length < 4) {
      Toast.show({ type: "error", text1: "Enter the verification code" });
      return;
    }
    try {
      const isValid = await verifyResetCode(code);
      if (isValid) {
        setStep("password");
      } else {
        Toast.show({ type: "error", text1: "Invalid code", text2: "Use 123456 for demo." });
      }
    } catch {
      Toast.show({ type: "error", text1: "Verification failed" });
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim()) {
      Toast.show({ type: "error", text1: "Enter a new password" });
      return;
    }
    if (newPassword !== confirmPassword) {
      Toast.show({ type: "error", text1: "Passwords do not match" });
      return;
    }
    try {
      await resetPassword(newPassword);
      setStep("success");
    } catch {
      Toast.show({ type: "error", text1: "Reset failed" });
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
        <TouchableOpacity
          onPress={() => (step === "email" ? router.back() : setStep("email"))}
          className="mx-5 w-10 h-10 rounded-full bg-gray-100 items-center justify-center mb-8"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#121D55" />
        </TouchableOpacity>

        <View className="px-6">
          {step === "success" ? (
            <View className="flex-1 items-center pt-16">
              <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-6">
                <Ionicons name="checkmark-circle" size={40} color="#22C55E" />
              </View>
              <Text
                className="text-2xl text-gray-900 text-center mb-2"
                style={{ fontFamily: "Manrope_800ExtraBold" }}
              >
                Password Reset!
              </Text>
              <Text
                className="text-base text-gray-500 text-center mb-8"
                style={{ fontFamily: "Manrope_400Regular" }}
              >
                Your password has been successfully updated.
              </Text>
              <TouchableOpacity
                onPress={() => router.replace("/(auth)/login")}
                className="bg-primary rounded-2xl py-4 px-10 items-center"
                activeOpacity={0.85}
              >
                <Text
                  className="text-white text-base"
                  style={{ fontFamily: "Manrope_700Bold" }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text
                className="text-3xl text-primary mb-2"
                style={{ fontFamily: "Manrope_800ExtraBold" }}
              >
                {step === "email"
                  ? "Forgot Password?"
                  : step === "code"
                  ? "Enter Code"
                  : "New Password"}
              </Text>
              <Text
                className="text-base text-gray-500 mb-8"
                style={{ fontFamily: "Manrope_400Regular" }}
              >
                {step === "email"
                  ? "Enter your email and we'll send you a reset code."
                  : step === "code"
                  ? `We sent a code to ${email}. Enter it below.`
                  : "Create a new secure password."}
              </Text>

              {step === "email" && (
                <View className="gap-4">
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
                        className="flex-1 text-sm text-gray-900"
                        style={{ fontFamily: "Manrope_400Regular" }}
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={handleSendCode}
                    disabled={isLoading}
                    className={`bg-primary rounded-2xl py-4 items-center ${isLoading ? "opacity-70" : ""}`}
                    activeOpacity={0.85}
                  >
                    <Text
                      className="text-white text-base"
                      style={{ fontFamily: "Manrope_700Bold" }}
                    >
                      {isLoading ? "Sending..." : "Send Reset Code"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {step === "code" && (
                <View className="gap-4">
                  <View>
                    <Text
                      className="text-sm text-gray-700 mb-2"
                      style={{ fontFamily: "Manrope_600SemiBold" }}
                    >
                      Verification Code
                    </Text>
                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 gap-3">
                      <Ionicons name="key-outline" size={18} color="#9CA3AF" />
                      <TextInput
                        value={code}
                        onChangeText={setCode}
                        placeholder="Enter code (try: 123456)"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="number-pad"
                        className="flex-1 text-sm text-gray-900"
                        style={{ fontFamily: "Manrope_400Regular" }}
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={handleVerifyCode}
                    disabled={isLoading}
                    className={`bg-primary rounded-2xl py-4 items-center ${isLoading ? "opacity-70" : ""}`}
                    activeOpacity={0.85}
                  >
                    <Text
                      className="text-white text-base"
                      style={{ fontFamily: "Manrope_700Bold" }}
                    >
                      {isLoading ? "Verifying..." : "Verify Code"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {step === "password" && (
                <View className="gap-4">
                  <View>
                    <Text
                      className="text-sm text-gray-700 mb-2"
                      style={{ fontFamily: "Manrope_600SemiBold" }}
                    >
                      New Password
                    </Text>
                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 gap-3">
                      <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" />
                      <TextInput
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="New password"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        className="flex-1 text-sm text-gray-900"
                        style={{ fontFamily: "Manrope_400Regular" }}
                      />
                    </View>
                  </View>
                  <View>
                    <Text
                      className="text-sm text-gray-700 mb-2"
                      style={{ fontFamily: "Manrope_600SemiBold" }}
                    >
                      Confirm Password
                    </Text>
                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 gap-3">
                      <Ionicons name="lock-closed-outline" size={18} color="#9CA3AF" />
                      <TextInput
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Repeat password"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        className="flex-1 text-sm text-gray-900"
                        style={{ fontFamily: "Manrope_400Regular" }}
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={handleResetPassword}
                    disabled={isLoading}
                    className={`bg-primary rounded-2xl py-4 items-center ${isLoading ? "opacity-70" : ""}`}
                    activeOpacity={0.85}
                  >
                    <Text
                      className="text-white text-base"
                      style={{ fontFamily: "Manrope_700Bold" }}
                    >
                      {isLoading ? "Updating..." : "Update Password"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
