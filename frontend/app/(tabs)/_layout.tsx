import React from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors, spacing } from "@/src/theme";

const TABS: {
  name: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { name: "index", label: "Главная", icon: "home" },
  { name: "collections", label: "Подборки", icon: "grid" },
  { name: "profile", label: "Профиль", icon: "person" },
];

function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      style={[styles.wrap, { bottom: Math.max(insets.bottom, 14) }]}
      pointerEvents="box-none"
    >
      <BlurView intensity={40} tint="dark" style={styles.pill}>
        {state.routes.map((route, index) => {
          const meta = TABS.find((t) => t.name === route.name);
          if (!meta) return null;
          const focused = state.index === index;
          const onPress = () => {
            Haptics.selectionAsync().catch(() => {});
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
          return (
            <Pressable
              key={route.key}
              style={styles.item}
              onPress={onPress}
              testID={`tab-${meta.name}`}
            >
              <Ionicons
                name={meta.icon}
                size={22}
                color={focused ? colors.accent : colors.sub}
              />
              <Text
                style={[styles.label, focused && { color: colors.accent }]}
              >
                {meta.label}
              </Text>
            </Pressable>
          );
        })}
      </BlurView>
      <Pressable
        style={styles.fab}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          router.push("/search");
        }}
        testID="search-fab"
      >
        <BlurView intensity={40} tint="dark" style={styles.fabInner}>
          <Ionicons name="search" size={22} color={colors.sub} />
        </BlurView>
      </Pressable>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="collections" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: spacing.xl,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 32,
    paddingHorizontal: 6,
    paddingVertical: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    backgroundColor:
      Platform.OS === "android" ? "rgba(30,30,34,0.92)" : "rgba(30,30,34,0.6)",
  },
  item: {
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 22,
  },
  label: { color: colors.sub, fontSize: 10.5, fontWeight: "600" },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  fabInner: {
    flex: 1,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    backgroundColor:
      Platform.OS === "android" ? "rgba(30,30,34,0.92)" : "rgba(30,30,34,0.6)",
  },
});
