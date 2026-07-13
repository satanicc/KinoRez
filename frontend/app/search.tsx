import React, { useEffect, useRef, useState } from "react";
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

export default function Search() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const COL_W = (width - PADDING * 2 - GAP * 2) / 3;
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      try {
        const res = await api.search(q.trim());
        setResults(res.results);
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
