import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, radius } from "@/src/theme";
import { api, Poster } from "@/src/api";
import PosterCard from "@/src/components/PosterCard";

const CHIPS = [
  { key: "all", label: "Все" },
  { key: "tv", label: "Сериалы" },
  { key: "movie", label: "Фильмы" },
  { key: "anime", label: "Аниме" },
  { key: "cartoon", label: "Мультфильмы" },
];

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

export default function Home() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const COL_W = (width - PADDING * 2 - GAP * 2) / 3;
  const [filter, setFilter] = useState("all");
  const [data, setData] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageRef = useRef(1);
  const hasMore = useRef(true);

  const load = useCallback(
    async (kind: string, isRefresh = false) => {
      if (!isRefresh) setLoading(true);
      setError(false);
      pageRef.current = 1;
      hasMore.current = true;
      try {
        const res = await api.home(kind, 1);
        setData(dedupe(res.results));
        hasMore.current = res.results.length > 0;
      } catch {
        setError(true);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  const loadMore = useCallback(async () => {
    if (loadingMore || loading || !hasMore.current) return;
    setLoadingMore(true);
    const next = pageRef.current + 1;
    try {
      const res = await api.home(filter, next);
      if (res.results.length === 0) {
        hasMore.current = false;
      } else {
        pageRef.current = next;
        setData((prev) => dedupe([...prev, ...res.results]));
      }
    } catch {
      // ignore, keep existing list
    } finally {
      setLoadingMore(false);
    }
  }, [filter, loading, loadingMore]);

  useEffect(() => {
    load(filter);
  }, [filter, load]);

  const header = (
    <View>
      <Text style={[styles.pageTitle, { paddingTop: insets.top + spacing.sm }]}>
        Сейчас смотрят
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
      >
        {CHIPS.map((c) => {
          const active = c.key === filter;
          return (
            <Pressable
              key={c.key}
              onPress={() => setFilter(c.key)}
              style={[styles.chip, active && styles.chipActive]}
              testID={`chip-${c.key}`}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {c.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <>
          {header}
          <ActivityIndicator
            color={colors.accent}
            style={{ marginTop: 60 }}
            size="large"
          />
        </>
      ) : error ? (
        <>
          {header}
          <View style={styles.center}>
            <Text style={styles.errText}>Не удалось загрузить контент</Text>
            <Pressable
              style={styles.retryBtn}
              onPress={() => load(filter)}
              testID="home-retry"
            >
              <Text style={styles.retryText}>Повторить</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(i) => `${i.media_type}:${i.id}`}
          numColumns={3}
          ListHeaderComponent={header}
          columnWrapperStyle={styles.column}
          contentContainerStyle={{
            paddingHorizontal: PADDING,
            paddingBottom: 130,
          }}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.6}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                color={colors.accent}
                style={{ marginVertical: 20 }}
              />
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              tintColor={colors.accent}
              onRefresh={() => {
                setRefreshing(true);
                load(filter, true);
              }}
            />
          }
          renderItem={({ item }) => <PosterCard item={item} width={COL_W} />}
          ListEmptyComponent={
            <Text style={styles.errText}>Ничего не найдено</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  pageTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.md,
    letterSpacing: -0.3,
  },
  chipRow: { gap: 8, paddingBottom: spacing.lg, paddingHorizontal: spacing.xs },
  chip: {
    flexShrink: 0,
    height: 36,
    justifyContent: "center",
    backgroundColor: colors.card2,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  chipActive: { backgroundColor: colors.accent },
  chipText: { color: colors.sub, fontSize: 13, fontWeight: "700" },
  chipTextActive: { color: colors.white },
  column: { gap: GAP },
  center: { alignItems: "center", marginTop: 80, gap: spacing.lg },
  errText: {
    color: colors.sub,
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
  },
  retryBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: radius.md,
  },
  retryText: { color: colors.white, fontWeight: "800", fontSize: 15 },
});
