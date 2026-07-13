import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors, spacing, radius } from "@/src/theme";
import { useStore } from "@/src/store";
import { Poster } from "@/src/api";
import AppSheet from "@/src/components/AppSheet";

type SheetKind = "recent" | "bookmarks" | "updates" | "downloads" | "logout" | null;

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

export default function Profile() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { auth, bookmarks, recent, logout } = useStore();
  const [sheet, setSheet] = useState<SheetKind>(null);

  const seriesUpdates = bookmarks.filter((b) => b.media_type === "tv");

  const openItem = (item: Poster) => {
    setSheet(null);
    router.push(`/detail/${item.media_type}/${item.id}`);
  };

  const iconBtn = (
    name: keyof typeof Ionicons.glyphMap,
    tone: string,
    onPress: () => void,
    tid: string,
  ) => (
    <Pressable
      style={[styles.iconBtn, { backgroundColor: tone + "24" }]}
      onPress={onPress}
      testID={tid}
    >
      <Ionicons name={name} size={18} color={tone} />
    </Pressable>
  );

  const menuItem = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    desc: string,
    onPress: () => void,
    tid: string,
  ) => (
    <Pressable style={styles.menuItem} onPress={onPress} testID={tid}>
      <Ionicons name={icon} size={20} color={colors.accent} style={{ marginTop: 2 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuDesc}>{desc}</Text>
      </View>
    </Pressable>
  );

  const listRows = (items: Poster[], subFor: (i: Poster) => string, emptyText: string) => {
    if (!items.length)
      return <Text style={styles.sheetEmpty}>{emptyText}</Text>;
    return items.map((m) => (
      <Pressable
        key={`${m.media_type}:${m.id}`}
        style={styles.row}
        onPress={() => openItem(m)}
        testID={`row-${m.media_type}-${m.id}`}
      >
        {m.poster ? (
          <Image source={{ uri: m.poster }} style={styles.thumb} contentFit="cover" />
        ) : (
          <View style={[styles.thumb, { backgroundColor: colors.card2 }]} />
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.rowTitle} numberOfLines={1}>
            {m.title}
          </Text>
          <Text style={styles.rowSub}>{subFor(m)}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.sub} />
      </Pressable>
    ));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.topBar, { paddingTop: insets.top + spacing.md }]}>
          {auth.authed &&
            iconBtn("log-out-outline", "#ff8a75", () => setSheet("logout"), "logout-btn")}
          {iconBtn("download-outline", "#7fb0ff", () => setSheet("downloads"), "downloads-btn")}
        </View>

        {/* account card */}
        <View style={styles.accountCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {auth.authed ? initials(auth.name || "Гость") : "🎬"}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.accountName}>
              {auth.authed ? auth.name || "Без имени" : "Вы не вошли"}
            </Text>
            <Text style={styles.accountSub} numberOfLines={1}>
              {auth.authed
                ? auth.email
                : "Войдите, чтобы синхронизировать закладки"}
            </Text>
          </View>
          {auth.authed ? (
            <Pressable
              style={[styles.accountBtn, styles.ghost]}
              onPress={() => setSheet("logout")}
              testID="account-logout"
            >
              <Text style={styles.accountBtnText}>Выйти</Text>
            </Pressable>
          ) : (
            <Pressable
              style={styles.accountBtn}
              onPress={() => router.push("/auth")}
              testID="account-login"
            >
              <Text style={[styles.accountBtnText, { color: colors.white }]}>
                Войти
              </Text>
            </Pressable>
          )}
        </View>

        {menuItem(
          "time-outline",
          "Досмотреть",
          "Продолжайте смотреть фильмы и сериалы с места, на котором остановились",
          () => setSheet("recent"),
          "menu-recent",
        )}
        {menuItem(
          "bookmark-outline",
          "Закладки",
          "Смотрите избранные или отложенные фильмы, сохранённые ранее",
          () => setSheet("bookmarks"),
          "menu-bookmarks",
        )}
        {menuItem(
          "notifications-outline",
          "Обновления сериалов",
          "Отслеживайте выход новых эпизодов у сериалов, которые вы смотрите",
          () => setSheet("updates"),
          "menu-updates",
        )}
      </ScrollView>

      <AppSheet
        visible={sheet === "recent"}
        onClose={() => setSheet(null)}
        title="Досмотреть"
        testID="sheet-recent"
      >
        <View style={{ paddingBottom: spacing.md }}>
          {listRows(
            recent,
            (m) => (m.media_type === "tv" ? "Продолжить просмотр" : m.year),
            "Пока нечего досматривать.\nНачните смотреть что-нибудь — прогресс появится здесь.",
          )}
        </View>
      </AppSheet>

      <AppSheet
        visible={sheet === "bookmarks"}
        onClose={() => setSheet(null)}
        title="Закладки"
        testID="sheet-bookmarks"
      >
        <View style={{ paddingBottom: spacing.md }}>
          {listRows(
            bookmarks,
            (m) => `${m.kind}${m.year ? ", " + m.year : ""}`,
            "Пока пусто.\nДобавляйте фильмы и сериалы в закладки, чтобы быстро находить их здесь.",
          )}
        </View>
      </AppSheet>

      <AppSheet
        visible={sheet === "updates"}
        onClose={() => setSheet(null)}
        title="Обновления сериалов"
        testID="sheet-updates"
      >
        <View style={{ paddingBottom: spacing.md }}>
          {listRows(
            seriesUpdates,
            () => "Новая серия доступна",
            "Нет отслеживаемых сериалов.\nДобавьте сериал в закладки, чтобы следить за новыми сериями.",
          )}
        </View>
      </AppSheet>

      <AppSheet
        visible={sheet === "downloads"}
        onClose={() => setSheet(null)}
        title="Загрузки"
        testID="sheet-downloads"
      >
        <Text style={styles.sheetEmpty}>
          Загруженных серий и фильмов пока нет.{"\n"}Загружайте видео из карточки
          фильма, чтобы смотреть офлайн.
        </Text>
      </AppSheet>

      <AppSheet
        visible={sheet === "logout"}
        onClose={() => setSheet(null)}
        testID="sheet-logout"
      >
        <Text style={styles.logoutTitle}>Выйти из аккаунта?</Text>
        <View style={styles.optionGroup}>
          <Pressable
            style={styles.optionRow}
            onPress={() => setSheet(null)}
            testID="logout-cancel"
          >
            <Text style={styles.optionText}>Отмена</Text>
          </Pressable>
          <Pressable
            style={styles.optionRow}
            onPress={() => {
              logout();
              setSheet(null);
            }}
            testID="logout-confirm"
          >
            <Text style={[styles.optionText, { color: colors.accent }]}>
              Выйти
            </Text>
          </Pressable>
        </View>
      </AppSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  accountCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2a2a2d",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: colors.white, fontWeight: "800", fontSize: 16 },
  accountName: { color: colors.text, fontSize: 15, fontWeight: "700" },
  accountSub: { color: colors.sub, fontSize: 12.5, marginTop: 2 },
  accountBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  ghost: { backgroundColor: colors.card2 },
  accountBtnText: { color: colors.text, fontSize: 13, fontWeight: "700" },
  menuItem: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
  },
  menuTitle: { color: colors.text, fontSize: 15, fontWeight: "700", marginBottom: 3 },
  menuDesc: { color: colors.sub, fontSize: 12.5, lineHeight: 18 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: spacing.lg,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: 10,
  },
  thumb: { width: 42, height: 58, borderRadius: 8 },
  rowTitle: { color: colors.white, fontSize: 14.5, fontWeight: "700" },
  rowSub: { color: colors.sub, fontSize: 12, marginTop: 2 },
  sheetEmpty: {
    color: colors.sub,
    textAlign: "center",
    paddingVertical: 40,
    paddingHorizontal: 30,
    fontSize: 14,
    lineHeight: 20,
  },
  logoutTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
    paddingVertical: spacing.md,
  },
  optionGroup: {
    marginHorizontal: spacing.lg,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  optionRow: {
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  optionText: { color: colors.white, fontSize: 15.5, fontWeight: "600" },
});
