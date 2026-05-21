import { ScrollView, StyleSheet } from "react-native";

import { BackButton } from "@/components/back-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function AvaliacoesScreen() {
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
          Avaliações
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Acompanhe exames, resultados e relatórios de desempenho.
        </ThemedText>

        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
          Últimas avaliações
        </ThemedText>
        <ThemedText style={styles.cardText}>
          - Exame médico concluído para 8 candidatos
        </ThemedText>
        <ThemedText style={styles.cardText}>
          - Relatório de aptidão disponível
        </ThemedText>
        <ThemedText style={styles.cardText}>
          - Agendar nova bateria de provas
        </ThemedText>

        <ThemedText
          type="defaultSemiBold"
          style={[styles.cardTitle, { marginTop: 18 }]}
        >
          Próximos passos
        </ThemedText>
        <ThemedText style={styles.cardText}>
          - Atualizar calendário de exames
        </ThemedText>
        <ThemedText style={styles.cardText}>
          - Informar candidatos liberados
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
