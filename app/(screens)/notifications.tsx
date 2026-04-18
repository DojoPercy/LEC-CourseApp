import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PageHeader from "@/components/reusable/PageHeader";
import EmptyState from "@/components/reusable/EmptyState";

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white">
      <View style={{ paddingTop: insets.top }}>
        <PageHeader title="Notifications" />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flex: 1, paddingBottom: insets.bottom + 24 }}
      >
        <EmptyState
          icon="notifications-outline"
          title="No Notifications"
          subtitle="You're all caught up. Check back later."
        />
      </ScrollView>
    </View>
  );
}
