import { ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";

const etapas = [
  {
    nome: "Inscrição",
    status: "Concluída",
    data: "15/05/2026",
    icone: "person.fill.checkmark",
  },
  {
    nome: "Análise documental",
    status: "Em andamento",
    data: "20/05/2026",
    icone: "doc.text.magnifyingglass",
  },
  {
    nome: "Exame médico",
    status: "Pendente",
    data: "25/05/2026",
    icone: "stethoscope",
  },
  {
    nome: "Teste físico",
    status: "Pendente",
    data: "30/05/2026",
    icone: "figure.run",
  },
  {
    nome: "Entrevista",
    status: "Pendente",
    data: "05/06/2026",
    icone: "bubble.left.and.bubble.right.fill",
  },
  {
    nome: "Aprovação final",
    status: "Pendente",
    data: "10/06/2026",
    icone: "checkmark.seal.fill",
  },
];

export default function StatusSelecaoScreen() {
  const background = useThemeColor(
    { light: "#f8fafc", dark: "#0f172a" },
    "background",
  );
  const cardBackground = useThemeColor(
    { light: "#ffffff", dark: "#111827" },
    "background",
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluída":
        return "#10b981";
      case "Em andamento":
        return "#3b82f6";
      case "Pendente":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Concluída":
        return "checkmark.circle.fill";
      case "Em andamento":
        return "clock.fill";
      case "Pendente":
        return "circle";
      default:
        return "circle";
    }
  };

  return (
    <ThemedView style={[styles.page, { backgroundColor: background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Status de seleção
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Acompanhe o progresso do seu processo seletivo.
        </ThemedText>

        <View style={[styles.section, { backgroundColor: cardBackground }]}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Etapas do processo
          </ThemedText>
          {etapas.map((etapa, index) => (
            <View key={index} style={styles.etapaCard}>
              <View style={styles.etapaIcon}>
                <IconSymbol name={etapa.icone} size={20} color="#0a7ea4" />
              </View>
              <View style={styles.etapaInfo}>
                <ThemedText type="defaultSemiBold">{etapa.nome}</ThemedText>
                <ThemedText style={styles.etapaData}>{etapa.data}</ThemedText>
              </View>
              <View style={styles.etapaStatus}>
                <IconSymbol
                  name={getStatusIcon(etapa.status)}
                  size={16}
                  color={getStatusColor(etapa.status)}
                />
                <ThemedText
                  style={[
                    styles.statusText,
                    { color: getStatusColor(etapa.status) },
                  ]}
                >
                  {etapa.status}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: cardBackground }]}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Próximos passos
          </ThemedText>
          <ThemedText style={styles.infoText}>
            • Aguarde a análise dos documentos enviados
          </ThemedText>
          <ThemedText style={styles.infoText}>
            • Prepare-se para o exame médico
          </ThemedText>
          <ThemedText style={styles.infoText}>
            • Mantenha seus dados atualizados
          </ThemedText>
          <ThemedText style={styles.infoText}>
            • Verifique regularmente este status
          </ThemedText>
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
  section: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  etapaCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 12,
  },
  etapaIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#e0f2fe",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  etapaInfo: {
    flex: 1,
  },
  etapaData: {
    color: "#64748b",
    marginTop: 4,
  },
  etapaStatus: {
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "600",
  },
  infoText: {
    marginBottom: 8,
    color: "#475569",
  },
});
