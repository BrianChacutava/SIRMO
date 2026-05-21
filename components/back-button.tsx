import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";

export function BackButton() {
  const router = useRouter();
  const background = useThemeColor(
    { light: "#f8fafc", dark: "#111827" },
    "background",
  );
  const borderColor = useThemeColor(
    { light: "#cbd5e1", dark: "#334155" },
    "background",
  );
  const tintColor = useThemeColor(
    { light: "#0a7ea4", dark: "#7dd3fc" },
    "tint",
  );

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, { backgroundColor: background, borderColor }]}
        onPress={() => router.back()}
      >
        <IconSymbol
          name="chevron.left.circle.fill"
          size={20}
          color={tintColor}
        />
        <ThemedText style={[styles.label, { color: tintColor }]}>
          Voltar
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  label: {
    marginLeft: 8,
    color: "#0a7ea4",
    fontWeight: "600",
  },
});
