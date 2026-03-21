import { Stack } from "expo-router";

export default function ScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
      <Stack.Screen name="course-detail" />
      <Stack.Screen name="notifications" />
    </Stack>
  );
}
