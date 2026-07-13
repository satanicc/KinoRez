import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
  Share,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { colors, spacing, radius } from "@/src/theme";
import { api, Detail as DetailType } from "@/src/api";
import PosterCard from "@/src/components/PosterCard";
import AppSheet from "@/src/components/AppSheet";
import { useStore } from "@/src/store";

const VOICES = [
  "Дубляж",
  "Universal Russia",
  "TVShows",
  "HDrezka Studio",
  "Оригинал (+субтитры)",
];
const QUALITIES = ["360p", "480p", "720p", "1080p", "1080p Ultra"];

type Step = "watch" | "voice" | "season" | "episode" | "quality" | null;

export default function Detail() {
  const { type, id } = useLocalSearchParams<{ type: string; id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { height: winH } = useWindowDimensions();
  const heroH = Math.max(380, Math.round(winH * 0.52));
  const { isBookmarked, toggleBookmark, pushRecent } = useStore();

  const [data, setData] = useState<DetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [step, setStep] = useState<Step>(null);
  const [voiceIdx, setVoiceIdx] = useState(0);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const d = await api.detail(String(type), String(id));
      setData(d);
      pushRecent({
        id: d.id,
        media_type: d.media_type,
        title: d.title,
        year: d.year,
        poster: d.poster,
        backdrop: d.backdrop,
        rating: d.rating,
        kind: d.media_type === "movie" ? "Фильм" : "Сериал",
      });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, id]);

  if (loading) {
    return (
      <View style={styles.centerScreen}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.centerScreen}>
        <Text style={styles.errText}>Не удалось загрузить информацию</Text>
        <Pressable style={styles.retryBtn} onPress={load} testID="detail-retry">
          <Text style={styles.retryText}>Повторить</Text>
        </Pressable>
      </View>
    );
  }

  const isSeries = data.seasons > 0;
  const bm = isBookmarked(data.id);
  const epMax = isSeries ? Math.max(1, Math.min(data.episodes || 12, 30)) : 0;

  const onBookmark = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    toggleBookmark({
      id: data.id,
      media_type: data.media_type,
      title: data.title,
      year: data.year,
      poster: data.poster,
      backdrop: data.backdrop,
      rating: data.rating,
      kind: data.media_type === "movie" ? "Фильм" : "Сериал",
    });
  };

  const onShare = () => {
    Share.share({
      message: `${data.title} (${data.year}) — смотрите в KinoRez`,
    }).catch(() => {});
  };

  const startPlayer = () => {
    setStep(null);
    router.push({
      pathname: "/player",
      params: {
        title: data.title,
        sub: isSeries ? `${season} сезон • ${episode} серия` : data.year,
        trailer: data.trailer || "",
        backdrop: data.backdrop || "",
      },
    });
  };

  const stat = (v: string, l: string) => (
    <View style={styles.stat}>
      <Text style={styles.statV}>{v}</Text>
      <Text style={styles.statL}>{l}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* hero */}
        <View style={[styles.hero, { height: heroH }]}>
          {data.backdrop ? (
            <Image source={{ uri: data.backdrop }} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="center" transition={300} />
          ) : (
            <LinearGradient colors={["#26364a", colors.bg]} style={StyleSheet.absoluteFill} />
          )}
          <LinearGradient colors={["rgba(0,0,0,0.25)", "rgba(10,10,11,0.1)", colors.bg]} style={StyleSheet.absoluteFill} />
          <View style={[styles.topControls, { paddingTop: insets.top + 8 }]}>
            <Pressable style={styles.circleBtn} onPress={() => router.back()} testID="detail-back">
              <Ionicons name="chevron-back" size={18} color={colors.white} />
            </Pressable>
            <Pressable style={styles.circleBtn} onPress={onShare} testID="detail-share">
              <Ionicons name="share-outline" size={18} color={colors.white} />
            </Pressable>
          </View>
          <Text style={styles.heroTitle} numberOfLines={3}>
            {data.title}
          </Text>
        </View>

        <Text style={styles.meta}>
          {`${data.genres.split(",")[0]} • ${data.year} • ${data.country}`.toUpperCase()}
        </Text>

        {/* actions */}
        <View style={styles.actions}>
          <Pressable style={styles.watchBtn} onPress={() => setStep("watch")} testID="watch-button">
            <Ionicons name="play" size={16} color="#000" />
            <Text style={styles.watchText}>Смотреть</Text>
          </Pressable>
          <Pressable style={[styles.bookmarkBtn, bm && { borderColor: colors.accent }]} onPress={onBookmark} testID="bookmark-button">
            <Ionicons name={bm ? "bookmark" : "bookmark-outline"} size={20} color={bm ? colors.accent : colors.white} />
          </Pressable>
        </View>

        {/* stats */}
        <View style={styles.statsRow}>
          {stat(data.rating ? data.rating.toFixed(1) : "—", "TMDB")}
          {stat(data.vote_count ? `${(data.vote_count / 1000).toFixed(1)}K` : "—", "Оценки")}
          {stat(data.runtime, "Длительность")}
          {stat(data.age, "Возраст")}
        </View>

        <Text style={styles.desc}>{data.overview}</Text>

        {/* cast */}
        {data.cast.length > 0 && (
          <>
            <Text style={styles.blockTitle}>Актёры</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.castScroll}>
              {data.cast.map((c, i) => (
                <View key={i} style={styles.castItem}>
                  {c.profile ? (
                    <Image source={{ uri: c.profile }} style={styles.castAvatar} contentFit="cover" />
                  ) : (
                    <View style={[styles.castAvatar, styles.castAvatarFallback]}>
                      <Text style={styles.castInitials}>
                        {c.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.castName} numberOfLines={2}>{c.name}</Text>
                </View>
              ))}
            </ScrollView>
          </>
        )}

        {/* similar */}
        {data.similar.length > 0 && (
          <>
            <Text style={styles.blockTitle}>Похожие</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.similarScroll}>
              {data.similar.map((s) => (
                <View key={`${s.media_type}:${s.id}`} style={{ width: 100, marginRight: 10 }}>
                  <PosterCard item={s} width={100} />
                </View>
              ))}
            </ScrollView>
          </>
        )}

        {/* info */}
        <View style={styles.info}>
          <InfoRow label="Жанр" value={data.genres} />
          <InfoRow label="Страна" value={data.country} />
          {isSeries && <InfoRow label="Сезонов" value={`${data.seasons} • ${data.episodes} эпизодов`} />}
          {!!data.original_title && data.original_title !== data.title && (
            <InfoRow label="Оригинальное название" value={data.original_title} last />
          )}
        </View>
      </ScrollView>

      {/* watch sheet flow */}
      <AppSheet
        visible={step === "watch"}
        onClose={() => setStep(null)}
        title="Смотреть"
        testID="sheet-watch"
      >
        <View style={styles.optionGroup}>
          <OptionRow label="Озвучка" value={VOICES[voiceIdx]} onPress={() => setStep("voice")} tid="opt-voice" />
          {isSeries && <OptionRow label="Сезон" value={`Сезон ${season}`} onPress={() => setStep("season")} tid="opt-season" />}
          {isSeries && <OptionRow label="Серия" value={`Серия ${episode}`} onPress={() => setStep("episode")} tid="opt-episode" last />}
        </View>
        <Pressable style={styles.cta} onPress={() => setStep("quality")} testID="watch-continue">
          <Text style={styles.ctaText}>Продолжить</Text>
          <Ionicons name="chevron-forward" size={18} color="#000" />
        </Pressable>
      </AppSheet>

      <AppSheet visible={step === "voice"} onClose={() => setStep(null)} onBack={() => setStep("watch")} title="Озвучка" testID="sheet-voice">
        {VOICES.map((v, i) => (
          <PickerItem key={i} label={v} checked={i === voiceIdx} onPress={() => { setVoiceIdx(i); setStep("watch"); }} tid={`voice-${i}`} />
        ))}
      </AppSheet>

      <AppSheet visible={step === "season"} onClose={() => setStep(null)} onBack={() => setStep("watch")} title="Сезон" testID="sheet-season">
        {Array.from({ length: Math.max(1, data.seasons) }, (_, i) => i + 1).map((s) => (
          <PickerItem key={s} label={`Сезон ${s}`} checked={s === season} onPress={() => { setSeason(s); setEpisode(1); setStep("watch"); }} tid={`season-${s}`} />
        ))}
      </AppSheet>

      <AppSheet visible={step === "episode"} onClose={() => setStep(null)} onBack={() => setStep("watch")} title="Серия" testID="sheet-episode">
        {Array.from({ length: epMax }, (_, i) => i + 1).map((e) => (
          <PickerItem key={e} label={`Серия ${e}`} checked={e === episode} onPress={() => { setEpisode(e); setStep("watch"); }} tid={`episode-${e}`} />
        ))}
      </AppSheet>

      <AppSheet visible={step === "quality"} onClose={() => setStep(null)} onBack={() => setStep("watch")} title="Выберите качество" testID="sheet-quality">
        {QUALITIES.map((q, i) => (
          <Pressable key={i} style={styles.qualityItem} onPress={startPlayer} testID={`quality-${i}`}>
            <Text style={styles.qualityText}>{q}</Text>
            {q.includes("Ultra") && <Text style={styles.qualityTag}>HD</Text>}
          </Pressable>
        ))}
      </AppSheet>
    </View>
  );
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function OptionRow({ label, value, onPress, tid, last }: { label: string; value: string; onPress: () => void; tid: string; last?: boolean }) {
  return (
    <Pressable style={[styles.optionRow, last && { borderBottomWidth: 0 }]} onPress={onPress} testID={tid}>
      <Text style={styles.optionLabel}>{label}</Text>
      <View style={styles.optionValWrap}>
        <Text style={styles.optionVal}>{value}</Text>
        <Ionicons name="swap-vertical" size={14} color={colors.sub} />
      </View>
    </Pressable>
  );
}

function PickerItem({ label, checked, onPress, tid }: { label: string; checked: boolean; onPress: () => void; tid: string }) {
  return (
    <Pressable style={styles.pickerItem} onPress={onPress} testID={tid}>
      <View style={{ width: 20 }}>
        {checked && <Ionicons name="checkmark" size={18} color={colors.accent} />}
      </View>
      <Text style={styles.pickerText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  centerScreen: { flex: 1, backgroundColor: colors.bg, alignItems: "center", justifyContent: "center", gap: spacing.lg },
  errText: { color: colors.sub, fontSize: 14 },
  retryBtn: { backgroundColor: colors.accent, paddingHorizontal: 24, paddingVertical: 12, borderRadius: radius.md },
  retryText: { color: colors.white, fontWeight: "800" },
  hero: { width: "100%", justifyContent: "flex-start" },
  topControls: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: spacing.lg },
  circleBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center" },
  heroTitle: { position: "absolute", bottom: spacing.md, left: 0, right: 0, color: colors.white, fontSize: 30, fontWeight: "900", paddingHorizontal: spacing.lg, textShadowColor: "rgba(0,0,0,0.5)", textShadowRadius: 14 },
  meta: { color: colors.sub, fontSize: 12.5, paddingHorizontal: spacing.lg, paddingTop: spacing.sm, letterSpacing: 0.3, fontWeight: "700" },
  actions: { flexDirection: "row", gap: 10, paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  watchBtn: { flex: 1, backgroundColor: colors.white, borderRadius: 14, paddingVertical: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  watchText: { color: "#000", fontSize: 16, fontWeight: "800" },
  bookmarkBtn: { width: 52, backgroundColor: colors.card2, borderRadius: 14, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "transparent" },
  statsRow: { flexDirection: "row", justifyContent: "space-around", paddingVertical: spacing.lg, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, borderColor: colors.line, marginHorizontal: spacing.lg },
  stat: { alignItems: "center" },
  statV: { color: colors.text, fontSize: 17, fontWeight: "800" },
  statL: { color: colors.sub, fontSize: 11, marginTop: 2 },
  desc: { color: colors.text, fontSize: 14.5, lineHeight: 22, paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  blockTitle: { color: colors.text, fontSize: 17, fontWeight: "800", paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md },
  castScroll: { paddingHorizontal: spacing.lg, gap: 14 },
  castItem: { alignItems: "center", width: 64 },
  castAvatar: { width: 54, height: 54, borderRadius: 27 },
  castAvatarFallback: { backgroundColor: "#2a2a2d", alignItems: "center", justifyContent: "center" },
  castInitials: { color: colors.white, fontSize: 13, fontWeight: "800" },
  castName: { color: colors.sub, fontSize: 10.5, textAlign: "center", marginTop: 6, lineHeight: 13 },
  similarScroll: { paddingHorizontal: spacing.lg },
  info: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  infoRow: { paddingVertical: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  infoLabel: { color: colors.text, fontSize: 14, fontWeight: "700", marginBottom: 3 },
  infoValue: { color: colors.sub, fontSize: 13.5, lineHeight: 18 },
  optionGroup: { marginHorizontal: spacing.lg, backgroundColor: "rgba(255,255,255,0.07)", borderRadius: radius.lg, overflow: "hidden" },
  optionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 15, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "rgba(255,255,255,0.08)" },
  optionLabel: { color: colors.white, fontSize: 15.5, fontWeight: "600" },
  optionValWrap: { flexDirection: "row", alignItems: "center", gap: 6 },
  optionVal: { color: colors.sub, fontSize: 14.5 },
  cta: { marginHorizontal: spacing.lg, marginTop: spacing.lg, backgroundColor: colors.white, borderRadius: 14, paddingVertical: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  ctaText: { color: "#000", fontSize: 16, fontWeight: "800" },
  pickerItem: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 14, paddingHorizontal: spacing.xl },
  pickerText: { color: colors.white, fontSize: 16 },
  qualityItem: { flexDirection: "row", alignItems: "center", paddingVertical: 15, paddingHorizontal: spacing.xl, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: "rgba(255,255,255,0.08)" },
  qualityText: { color: colors.white, fontSize: 16, fontWeight: "600" },
  qualityTag: { color: colors.gold, fontSize: 11, fontWeight: "800", marginLeft: 8 },
});
