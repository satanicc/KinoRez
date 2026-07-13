import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, spacing } from "@/src/theme";
import { api, Poster } from "@/src/api";
import PosterCard from "@/src/components/PosterCard";

const GAP = 10;
const PADDING = spacing.lg;

export default function CollectionDetail() {
  const { key } = useLocalSearchParams<{ key: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const COL_W = (width - PADDING * 2 - GAP * 2) / 3;
  const [title, setTitle] = useState("Подборка");
  const [pg, setPg] = useState<[string, string]>(["#26364a", "#0a0a0a"]);
  const [data, setData] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.collection(String(key));
        setTitle(res.title);
        setPg(res.pg);
        setData(res.results);
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, [key]);

  const header = (
    <View style={styles.banner}>
      <LinearGradient colors={pg} style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={["rgba(0,0,0,0.1)", colors.bg]}
        style={StyleSheet.absoluteFill}
      />
      <Pressable
        style={[styles.back, { top: insets.top + 8 }]}
        onPress={() => router.back()}
        testID="collection-back"
      >
        <Ionicons name="chevron-back" size={22} color={colors.white} />
      </Pressable>
      <Text style={styles.bannerTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <>
          {header}
          <ActivityIndicator
            color={colors.accent}
            size="large"
            style={{ marginTop: 40 }}
          />
        </>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(i) => `${i.media_type}:${i.id}`}
          numColumns={3}
          ListHeaderComponent={header}
          columnWrapperStyle={{ gap: GAP, paddingHorizontal: PADDING }}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: spacing.lg }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <PosterCard item={item} width={COL_W} />}
          ListEmptyComponent={
            <Text style={styles.empty}>Пока нет тайтлов в этой подборке.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  banner: { height: 180, justifyContent: "flex-end" },
  back: {
    position: "absolute",
    left: spacing.lg,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "800",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  empty: {
    color: colors.sub,
    textAlign: "center",
    marginTop: 40,
    paddingHorizontal: 40,
  },
});
