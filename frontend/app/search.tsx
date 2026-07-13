import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors, spacing, radius } from "@/src/theme";
import { api, Poster } from "@/src/api";
import PosterCard from "@/src/components/PosterCard";

const GAP = 10;
const PADDING = spacing.lg;

const dedupe = (list: Poster[]) => {
  const seen = new Set<string>();
  return list.filter((i) => {
    const k = `${i.media_type}:${i.id}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

export default function Search() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const COL_W = (width - PADDING * 2 - GAP * 2) / 3;
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pageRef = useRef(1);
  const hasMore = useRef(true);
  const queryRef = useRef("");

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    debounce.current = setTimeout(async () => {
      setLoading(true);
      setSearched(true);
      pageRef.current = 1;
      hasMore.current = true;
      queryRef.current = q.trim();
      try {
        const res = await api.search(q.trim(), 1);
        setResults(dedupe(res.results));
        hasMore.current = res.results.length > 0;
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [q]);

  const loadMore = useCallback(async () => {
    if (loadingMore || loading || !hasMore.current || !queryRef.current) return;
    setLoadingMore(true);
    const next = pageRef.current + 1;
    try {
      const res = await api.search(queryRef.current, next);
      if (res.results.length === 0) {
        hasMore.current = false;
      } else {
        pageRef.current = next;
        setResults((prev) => dedupe([...prev, ...res.results]));
      }
    } catch {
    } finally {
      setLoadingMore(false);
    }
  }, [loading, loadingMore]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.topRow}>
          <Text style={styles.title}>Поиск</Text>
          <Pressable onPress={() => router.back()} testID="search-close">
            <Text style={styles.cancel}>Готово</Text>
          </Pressable>
        </View>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={colors.sub} />
          <TextInput
            style={styles.input}
            placeholder="Название фильма или сериала"
            placeholderTextColor={colors.sub}
            value={q}
            onChangeText={setQ}
            autoFocus
            returnKeyType="search"
            testID="search-input"
          />
          {q.length > 0 && (
            <Pressable onPress={() => setQ("")} testID="search-clear">
              <Ionicons name="close-circle" size={18} color={colors.sub} />
            </Pressable>
          )}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          color={colors.accent}
          size="large"
          style={{ marginTop: 60 }}
        />
      ) : searched ? (
        <FlatList
          data={results}
          keyExtractor={(i) => `${i.media_type}:${i.id}`}
          numColumns={3}
          columnWrapperStyle={{ gap: GAP }}
          contentContainerStyle={{
            paddingHorizontal: PADDING,
            paddingTop: spacing.lg,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.6}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator color={colors.accent} style={{ marginVertical: 20 }} />
            ) : null
          }
          renderItem={({ item }) => <PosterCard item={item} width={COL_W} />}
          ListEmptyComponent={
            <Text style={styles.empty}>Ничего не найдено</Text>
          }
        />
      ) : (
        <Text style={styles.empty}>
          Начните вводить название,{"\n"}чтобы найти фильм или сериал
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  title: { fontSize: 30, fontWeight: "800", color: colors.text },
  cancel: { color: colors.accent, fontSize: 15, fontWeight: "700" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.card2,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: { flex: 1, color: colors.text, fontSize: 15 },
  empty: {
    color: colors.sub,
    textAlign: "center",
    marginTop: 80,
    fontSize: 14,
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});
