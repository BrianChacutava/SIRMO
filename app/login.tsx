import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const cardBackground = useThemeColor(
    { light: "#ffffff", dark: "#1f2937" },
    "background",
  );
  const inputBackground = useThemeColor(
    { light: "#f6f8fa", dark: "#111827" },
    "background",
  );
  const inputBorder = useThemeColor(
    { light: "#d1d5db", dark: "#374151" },
    "background",
  );

  const handleLogin = () => {
    router.replace("/(tabs)");
  };

  return (
    <ThemedView style={styles.page}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.brandContainer}>
        <Image
          source={require("@/assets/images/sirmo.png")}
          style={styles.logo}
          contentFit="contain"
        />
        <ThemedText type="title" style={styles.brandTitle}>
          SIRMO
        </ThemedText>
      </View>

      <View style={[styles.card, { backgroundColor: cardBackground }]}>
        <ThemedText type="subtitle" style={styles.heading}>
          Faça login
        </ThemedText>
        <ThemedText style={styles.description}>
          Use seu email e senha para acessar o aplicativo.
        </ThemedText>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          keyboardType="email-address"
          style={[
            styles.input,
            { backgroundColor: inputBackground, borderColor: inputBorder },
          ]}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          style={[
            styles.input,
            { backgroundColor: inputBackground, borderColor: inputBorder },
          ]}
        />

        <Pressable style={styles.button} onPress={handleLogin}>
          <ThemedText type="defaultSemiBold" style={styles.buttonLabel}>
            Entrar
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#f7fafc",
  },
  brandContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 28,
    letterSpacing: 1,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
  },
  heading: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 24,
    color: "#6b7280",
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    color: "#111827",
  },
  button: {
    backgroundColor: "#0a7ea4",
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
  },
});
