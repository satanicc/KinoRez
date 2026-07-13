import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { colors, radius, spacing, gradientFor } from "@/src/theme";
import { Poster } from "@/src/api";

export default function PosterCard({
  item,
  width,
}: {
  item: Poster;
  width: number;
}) {
  const router = useRouter();
  const grad = gradientFor(item.id);

  const open = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.push(`/detail/${item.media_type}/${item.id}`);
  };

  return (
    <Pressable
      style={[styles.wrap, { width }]}
      onPress={open}
      testID={`poster-${item.media_type}-${item.id}`}
    >
      <View style={styles.poster}>
        {item.poster ? (
          <Image
            source={{ uri: item.poster }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={250}
          />
        ) : (
          <LinearGradient colors={grad} style={StyleSheet.absoluteFill} />
        )}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.55)"]}
          style={styles.scrim}
        />
        {item.rating > 0 && (
          <View style={styles.rating}>
            <Ionicons name="star" size={9} color={colors.gold} />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
      {!!item.year && <Text style={styles.year}>{item.year}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg },
  poster: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.card2,
  },
  scrim: { position: "absolute", left: 0, right: 0, bottom: 0, height: "45%" },
  rating: {
    position: "absolute",
    top: 6,
    right: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  ratingText: { color: colors.white, fontSize: 10.5, fontWeight: "700" },
  title: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 15,
    marginTop: 7,
  },
  year: { color: colors.sub, fontSize: 10.5, marginTop: 2 },
});
