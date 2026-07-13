import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors, spacing } from "@/src/theme";
import { useStore } from "@/src/store";

export default function Auth() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { login } = useStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const isLogin = mode === "login";

  const submit = () => {
    if (!email.trim()) {
      setErr("Введите email");
      return;
    }
    if (pass.length < 6) {
      setErr("Пароль должен быть не менее 6 символов");
      return;
    }
    login(email.trim(), isLogin ? "" : name.trim());
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={[styles.back, { marginTop: insets.top + 8 }]}
          onPress={() => router.back()}
          testID="auth-back"
        >
          <Ionicons name="chevron-back" size={20} color={colors.white} />
        </Pressable>

        <Text style={styles.title}>{isLogin ? "Вход" : "Регистрация"}</Text>

        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, isLogin && styles.tabActive]}
            onPress={() => { setMode("login"); setErr(""); }}
            testID="auth-tab-login"
          >
            <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Вход</Text>
          </Pressable>
          <Pressable
            style={[styles.tab, !isLogin && styles.tabActive]}
            onPress={() => { setMode("register"); setErr(""); }}
            testID="auth-tab-register"
          >
            <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Регистрация</Text>
          </Pressable>
        </View>

        {!isLogin && (
          <Field label="Имя">
            <TextInput
              style={styles.input}
              placeholder="Как к вам обращаться"
              placeholderTextColor={colors.sub}
              value={name}
              onChangeText={setName}
              testID="auth-name"
            />
          </Field>
        )}
        <Field label="Email">
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={colors.sub}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            testID="auth-email"
          />
        </Field>
        <Field label="Пароль">
          <TextInput
            style={styles.input}
            placeholder="Минимум 6 символов"
            placeholderTextColor={colors.sub}
            value={pass}
            onChangeText={setPass}
            secureTextEntry
            testID="auth-pass"
          />
        </Field>

        {!!err && <Text style={styles.err}>{err}</Text>}

        <Pressable style={styles.submit} onPress={submit} testID="auth-submit">
          <Text style={styles.submitText}>
            {isLogin ? "Войти" : "Зарегистрироваться"}
          </Text>
        </Pressable>

        <Text style={styles.hint}>
          Профиль хранится на устройстве — так вы сможете синхронизировать
          закладки и историю просмотров в этом приложении.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  back: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: spacing.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  tabs: {
    flexDirection: "row",
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    backgroundColor: colors.card2,
    borderRadius: 14,
    padding: 4,
  },
  tab: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 11 },
  tabActive: { backgroundColor: colors.accent },
  tabText: { color: colors.sub, fontWeight: "700", fontSize: 14 },
  tabTextActive: { color: colors.white },
  field: { marginHorizontal: spacing.lg, marginBottom: spacing.md },
  label: { color: colors.sub, fontSize: 12.5, fontWeight: "600", marginBottom: 6 },
  input: {
    backgroundColor: colors.card2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: colors.text,
    fontSize: 15,
  },
  err: { color: colors.accent, fontSize: 13, marginHorizontal: spacing.lg, marginTop: 4 },
  submit: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  submitText: { color: "#000", fontSize: 16, fontWeight: "800" },
  hint: {
    color: colors.sub,
    fontSize: 12.5,
    textAlign: "center",
    marginTop: spacing.md,
    paddingHorizontal: spacing.xxl,
    lineHeight: 18,
  },
});
