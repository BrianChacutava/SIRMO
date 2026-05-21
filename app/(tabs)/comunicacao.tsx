import { ScrollView, StyleSheet } from "react-native";

import { BackButton } from "@/components/back-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function ComunicacaoScreen() {
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
          Comunicação
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Central de mensagens e avisos oficiais do sistema.
        </ThemedText>

        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
          Notificações recentes
        </ThemedText>
        <ThemedText style={styles.cardText}>
          - Nova vaga publicada para recrutas
        </ThemedText>
        <ThemedText style={styles.cardText}>
          - Pendências de documentação atualizadas
        </ThemedText>
        <ThemedText style={styles.cardText}>
          - Resultado parcial do processo disponível
        </ThemedText>

        <ThemedText
          type="defaultSemiBold"
          style={[styles.cardTitle, { marginTop: 18 }]}
        >
          Mensagens
        </ThemedText>
        <ThemedText style={styles.cardText}>
          - Envie mensagens de convocação e instruções.
        </ThemedText>
        <ThemedText style={styles.cardText}>
          - Publique comunicados para todos os candidatos.
        </ThemedText>
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
  cardTitle: {
    marginBottom: 10,
  },
  cardText: {
    marginBottom: 10,
    color: "#475569",
  },
});
