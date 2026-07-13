import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/src/theme";

export default function AppSheet({
  visible,
  onClose,
  title,
  onBack,
  children,
  testID,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  onBack?: () => void;
  children: React.ReactNode;
  testID?: string;
}) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(400)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      translateY.setValue(400);
      opacity.setValue(0);
    }
  }, [visible, translateY, opacity]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, { opacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} testID="sheet-backdrop" />
        <Animated.View
          style={[
            styles.panel,
            { paddingBottom: insets.bottom + spacing.lg, transform: [{ translateY }] },
          ]}
          testID={testID}
        >
          <View style={styles.handle} />
          {(title || onBack) && (
            <View style={styles.header}>
              {onBack ? (
                <Pressable style={styles.roundBtn} onPress={onBack} testID="sheet-back">
                  <Ionicons name="chevron-back" size={20} color={colors.text} />
                </Pressable>
              ) : (
                <View style={styles.roundBtn} />
              )}
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              <Pressable style={styles.roundBtn} onPress={onClose} testID="sheet-close">
                <Ionicons name="close" size={18} color={colors.text} />
              </Pressable>
            </View>
          )}
          <ScrollView
            style={{ maxHeight: 460 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  panel: {
    backgroundColor: "#1c1c1e",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignSelf: "center",
    marginVertical: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  roundBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { flex: 1, textAlign: "center", color: colors.text, fontSize: 17, fontWeight: "800" },
});
