import { ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function ProcessosSeletivosScreen() {
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
        <ThemedText type="title" style={styles.title}>
          Processos seletivos
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Gerencie vagas abertas, etapas e classificação dos candidatos.
        </ThemedText>

        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
          Últimas ações
        </ThemedText>
        <ThemedText style={styles.cardText}>
          - 5 vagas abertas em análise
        </ThemedText>
        <ThemedText style={styles.cardText}>
          - 12 candidatos em triagem
        </ThemedText>
        <ThemedText style={styles.cardText}>
          - 3 processos em fase de entrevista
        </ThemedText>

        <ThemedText
          type="defaultSemiBold"
          style={[styles.cardTitle, { marginTop: 18 }]}
        >
          Próximas etapas
        </ThemedText>
        <ThemedText style={styles.cardText}>
          - Classificação final em 2 dias
        </ThemedText>
        <ThemedText style={styles.cardText}>
          - Avaliação médica para aprovados
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
