import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { BackButton } from "@/components/back-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";

const settingsItems = [
  {
    title: "Perfil e conta",
    description: "Atualizar dados pessoais e login.",
    icon: "person.crop.circle.fill",
  },
  {
    title: "Notificações",
    description: "Configurar alertas e avisos.",
    icon: "bell.fill",
  },
  {
    title: "Segurança",
    description: "Alterar senha e autenticação.",
    icon: "lock.fill",
  },
  {
    title: "Preferências",
    description: "Ajustar idioma e tema.",
    icon: "slider.horizontal.3",
  },
  {
    title: "Ajuda",
    description: "Suporte e documentação do sistema.",
    icon: "questionmark.circle.fill",
  },
] as const;

export default function ConfiguracoesScreen() {
  const background = useThemeColor(
    { light: "#f8fafc", dark: "#0f172a" },
    "background",
  );
  const cardBackground = useThemeColor(
    { light: "#ffffff", dark: "#111827" },
    "background",
  );

  return (
    <ThemedView style={[styles.page, { backgroundColor: background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <BackButton />
        <ThemedText type="title" style={styles.title}>
          Configurações
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Ajuste o comportamento do sistema e suas preferências.
        </ThemedText>

        <View style={[styles.card, { backgroundColor: cardBackground }]}>
          {settingsItems.map((item) => (
            <Pressable
              key={item.title}
              style={[styles.settingItem, { backgroundColor: cardBackground }]}
            >
              <View style={styles.settingIcon}>
                <IconSymbol name={item.icon} size={20} color="#0a7ea4" />
              </View>
              <View style={styles.settingText}>
                <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                <ThemedText style={styles.settingDescription}>
                  {item.description}
                </ThemedText>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 32,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 20,
    color: "#475569",
  },
  card: {
    borderRadius: 24,
    padding: 18,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#e0f2fe",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  settingText: {
    flex: 1,
  },
  settingDescription: {
    color: "#64748b",
    marginTop: 4,
  },
});
