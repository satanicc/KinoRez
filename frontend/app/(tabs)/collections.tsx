import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { colors, spacing, radius } from "@/src/theme";
import { api, Collection } from "@/src/api";

export default function Collections() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [data, setData] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.collections();
        setData(res.results);
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          color={colors.accent}
          size="large"
          style={{ marginTop: insets.top + 100 }}
        />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(c) => c.key}
          numColumns={2}
          ListHeaderComponent={
            <Text
              style={[styles.pageTitle, { paddingTop: insets.top + spacing.sm }]}
            >
              Подборки
            </Text>
          }
          columnWrapperStyle={{ gap: spacing.md }}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingBottom: 130,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={styles.cell}
              onPress={() => router.push(`/collection/${item.key}`)}
              testID={`collection-${item.key}`}
            >
              <LinearGradient
                colors={item.pg}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.tile}
              >
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.65)"]}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={styles.tileText}>{item.title}</Text>
              </LinearGradient>
              <Text style={styles.label} numberOfLines={2}>
                {item.title}
              </Text>
            </Pressable>
          )}
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
    marginBottom: spacing.md,
    letterSpacing: -0.3,
  },
  cell: { flex: 1, marginBottom: spacing.lg },
  tile: {
    aspectRatio: 16 / 10,
    borderRadius: radius.md,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
  },
  tileText: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 15,
    textAlign: "center",
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 8,
    lineHeight: 16,
  },
});
