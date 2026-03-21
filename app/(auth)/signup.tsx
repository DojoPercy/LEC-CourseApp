import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
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
import { useCoursesStore } from "@/stores/courses-store";
import type { MegaCenter } from "@/types/course";

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { register, isLoading } = useAuthStore();
  const { megaCenters, fetchMegaCenters } = useCoursesStore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedMegaCenter, setSelectedMegaCenter] = useState<MegaCenter | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [megaCenterSearch, setMegaCenterSearch] = useState("");
  const [loadingCenters, setLoadingCenters] = useState(false);

  useEffect(() => {
    if (megaCenters.length === 0) {
      setLoadingCenters(true);
      fetchMegaCenters().finally(() => setLoadingCenters(false));
    }
  }, []);

  const filteredCenters = megaCenters.filter((mc) =>
    mc.name.toLowerCase().includes(megaCenterSearch.toLowerCase())
  );

  const handleSignup = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      Toast.show({ type: "error", text1: "Please fill in all fields" });
      return;
    }
    if (!selectedMegaCenter) {
      Toast.show({ type: "error", text1: "Please select your Mega Center" });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({ type: "error", text1: "Passwords do not match" });
      return;
    }
    if (password.length < 6) {
      Toast.show({ type: "error", text1: "Password must be at least 6 characters" });
      return;
    }

    try {
      await register(firstName.trim(), lastName.trim(), email.trim(), password, selectedMegaCenter.id);
      router.replace("/(main)");
    } catch {
      Toast.show({ type: "error", text1: "Registration failed", text2: "Please try again." });
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
        {/* Back */}
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
            Create Account
          </Text>
          <Text
            className="text-base text-gray-500"
            style={{ fontFamily: "Manrope_400Regular" }}
          >
            Start your learning journey today
          </Text>
        </View>

        {/* Form */}
        <View className="px-6 gap-4">
          {/* Name row */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text
                className="text-sm text-gray-700 mb-2"
                style={{ fontFamily: "Manrope_600SemiBold" }}
              >
                First Name
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 gap-3">
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="John"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                  className="flex-1 text-sm text-gray-900"
                  style={{ fontFamily: "Manrope_400Regular" }}
                />
              </View>
            </View>
            <View className="flex-1">
              <Text
                className="text-sm text-gray-700 mb-2"
                style={{ fontFamily: "Manrope_600SemiBold" }}
              >
                Last Name
              </Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 gap-3">
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Doe"
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                  className="flex-1 text-sm text-gray-900"
                  style={{ fontFamily: "Manrope_400Regular" }}
                />
              </View>
            </View>
          </View>

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

          {/* Mega Center Picker */}
          <View>
            <Text
              className="text-sm text-gray-700 mb-2"
              style={{ fontFamily: "Manrope_600SemiBold" }}
            >
              Mega Center <Text className="text-red-500">*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowPicker(true)}
              className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 gap-3"
              activeOpacity={0.7}
            >
              <Ionicons name="location-outline" size={18} color="#9CA3AF" />
              {loadingCenters ? (
                <ActivityIndicator size="small" color="#9CA3AF" />
              ) : (
                <Text
                  className="flex-1 text-sm"
                  style={{
                    fontFamily: "Manrope_400Regular",
                    color: selectedMegaCenter ? "#111827" : "#9CA3AF",
                  }}
                  numberOfLines={1}
                >
                  {selectedMegaCenter ? selectedMegaCenter.name : "Select your mega center"}
                </Text>
              )}
              <Ionicons name="chevron-down" size={16} color="#9CA3AF" />
            </TouchableOpacity>
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
                placeholder="Min. 6 characters"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
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

          {/* Confirm Password */}
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
                secureTextEntry={!showPassword}
                className="flex-1 text-sm text-gray-900"
                style={{ fontFamily: "Manrope_400Regular" }}
              />
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            onPress={handleSignup}
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
              {isLoading ? "Creating Account..." : "Create Account"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign in link */}
        <View className="flex-row items-center justify-center gap-1 px-6 mt-6">
          <Text
            className="text-sm text-gray-500"
            style={{ fontFamily: "Manrope_400Regular" }}
          >
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")} activeOpacity={0.7}>
            <Text
              className="text-sm text-primary"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Mega Center Picker Modal */}
      <Modal
        visible={showPicker}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPicker(false)}
      >
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 16 }}>
          {/* Modal Header */}
          <View className="flex-row items-center justify-between px-5 mb-4">
            <Text
              className="text-lg text-gray-900"
              style={{ fontFamily: "Manrope_700Bold" }}
            >
              Select Mega Center
            </Text>
            <TouchableOpacity
              onPress={() => setShowPicker(false)}
              className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
            >
              <Ionicons name="close" size={18} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View className="mx-5 mb-3 flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 gap-3">
            <Ionicons name="search-outline" size={18} color="#9CA3AF" />
            <TextInput
              value={megaCenterSearch}
              onChangeText={setMegaCenterSearch}
              placeholder="Search mega centers..."
              placeholderTextColor="#9CA3AF"
              className="flex-1 text-sm text-gray-900"
              style={{ fontFamily: "Manrope_400Regular" }}
              autoFocus
            />
            {megaCenterSearch.length > 0 && (
              <TouchableOpacity onPress={() => setMegaCenterSearch("")}>
                <Ionicons name="close-circle" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          {loadingCenters ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#121D55" />
              <Text
                className="text-gray-400 text-sm mt-3"
                style={{ fontFamily: "Manrope_400Regular" }}
              >
                Loading mega centers...
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredCenters}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 24 }}
              ItemSeparatorComponent={() => <View className="h-px bg-gray-100" />}
              ListEmptyComponent={() => (
                <View className="py-12 items-center">
                  <Ionicons name="location-outline" size={36} color="#D1D5DB" />
                  <Text
                    className="text-gray-400 text-sm mt-2"
                    style={{ fontFamily: "Manrope_400Regular" }}
                  >
                    No mega centers found
                  </Text>
                </View>
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedMegaCenter(item);
                    setShowPicker(false);
                    setMegaCenterSearch("");
                  }}
                  className="py-4 flex-row items-center justify-between"
                  activeOpacity={0.7}
                >
                  <View className="flex-1">
                    <Text
                      className="text-sm text-gray-900"
                      style={{ fontFamily: "Manrope_600SemiBold" }}
                    >
                      {item.name}
                    </Text>
                    {item.church && (
                      <Text
                        className="text-xs text-gray-400 mt-0.5"
                        style={{ fontFamily: "Manrope_400Regular" }}
                      >
                        {item.church}
                      </Text>
                    )}
                  </View>
                  {selectedMegaCenter?.id === item.id && (
                    <Ionicons name="checkmark-circle" size={20} color="#121D55" />
                  )}
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
