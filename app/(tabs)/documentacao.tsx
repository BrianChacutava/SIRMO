import { ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function DocumentacaoScreen() {
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
          Documentação
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Gerencie a entrega e o status dos documentos exigidos.
        </ThemedText>

        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
          Documentos pendentes
        </ThemedText>
        <ThemedText style={styles.cardText}>- RG e CPF</ThemedText>
        <ThemedText style={styles.cardText}>
          - Certificado de reservista
        </ThemedText>
        <ThemedText style={styles.cardText}>
          - Comprovante de residência
        </ThemedText>

        <ThemedText
          type="defaultSemiBold"
          style={[styles.cardTitle, { marginTop: 18 }]}
        >
          Orientações
        </ThemedText>
        <ThemedText style={styles.cardText}>
          - Digitalize em boa qualidade.
        </ThemedText>
        <ThemedText style={styles.cardText}>
          - Verifique os prazos de envio.
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
