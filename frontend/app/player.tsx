import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "@/src/theme";

export default function Player() {
  const { title, sub, trailer, backdrop } = useLocalSearchParams<{
    title: string;
    sub: string;
    trailer: string;
    backdrop: string;
  }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const hasTrailer = !!trailer;
  const embedUrl = `https://www.youtube.com/embed/${trailer}?autoplay=1&playsinline=1&modestbranding=1&rel=0`;

  return (
    <View style={styles.container}>
      {hasTrailer ? (
        <>
          <WebView
            source={{ uri: embedUrl }}
            style={styles.video}
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled
            onLoadEnd={() => setLoading(false)}
          />
          {loading && (
            <View style={styles.loadingOverlay} pointerEvents="none">
              <ActivityIndicator color={colors.accent} size="large" />
            </View>
          )}
        </>
      ) : (
        <View style={styles.noTrailer}>
          {backdrop ? (
            <Image source={{ uri: backdrop }} style={StyleSheet.absoluteFill} contentFit="cover" blurRadius={4} />
          ) : null}
          <LinearGradient colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.85)"]} style={StyleSheet.absoluteFill} />
          <Ionicons name="film-outline" size={48} color={colors.sub} />
          <Text style={styles.noTrailerText}>Трейлер недоступен для этого тайтла</Text>
          <Text style={styles.noTrailerHint}>
            Демонстрационный плеер. Реальный видеопоток можно подключить позже.
          </Text>
        </View>
      )}

      <View style={[styles.topBar, { paddingTop: insets.top + 6 }]} pointerEvents="box-none">
        <Pressable style={styles.closeBtn} onPress={() => router.back()} testID="player-close">
          <Ionicons name="chevron-back" size={22} color={colors.white} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {!!sub && <Text style={styles.sub}>{sub}</Text>}
        </View>
        <View style={{ width: 40 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  video: { flex: 1, backgroundColor: "#000" },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center", backgroundColor: "#000" },
  noTrailer: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.md, paddingHorizontal: spacing.xl },
  noTrailerText: { color: colors.white, fontSize: 16, fontWeight: "700", textAlign: "center" },
  noTrailerHint: { color: colors.sub, fontSize: 13, textAlign: "center", lineHeight: 18 },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center" },
  title: { color: colors.white, fontSize: 15, fontWeight: "800" },
  sub: { color: "rgba(255,255,255,0.65)", fontSize: 12, marginTop: 2 },
});
