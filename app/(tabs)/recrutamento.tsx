import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";

const menuItems = [
  {
    title: "Gestão de candidatos",
    description: "Cadastrar candidatos e acompanhar status.",
    route: "/gestao-candidatos",
    icon: "person.3.fill",
  },
  {
    title: "Processos seletivos",
    description: "Gerenciar vagas e etapas de seleção.",
    route: "/processos-seletivos",
    icon: "flag.fill",
  },
  {
    title: "Avaliações",
    description: "Agendar exames e consultar resultados.",
    route: "/avaliacoes",
    icon: "doc.text.fill",
  },
  {
    title: "Documentação",
    description: "Enviar e verificar documentos pendentes.",
    route: "/documentacao",
    icon: "doc.text.fill",
  },
  {
    title: "Comunicação",
    description: "Mensagens oficiais e notificações.",
    route: "/comunicacao",
    icon: "bubble.left.and.bubble.right.fill",
  },
] as const;

export default function RecrutamentoScreen() {
  const router = useRouter();
  const background = useThemeColor(
    { light: "#eef2ff", dark: "#0f172a" },
    "background",
  );
  const cardBackground = useThemeColor(
    { light: "#ffffff", dark: "#111827" },
    "background",
  );

  return (
    <ThemedView style={[styles.page, { backgroundColor: background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.pageHeader}>
            <ThemedText type="title">Recrutamento Militar</ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Menu principal com acesso rápido aos módulos do sistema.
            </ThemedText>
          </View>
          <Pressable
            style={styles.logoutButton}
            onPress={() => router.replace("/login")}
          >
            <ThemedText type="defaultSemiBold" style={styles.logoutText}>
              Logout
            </ThemedText>
          </Pressable>
        </View>

        <View style={[styles.section, { backgroundColor: cardBackground }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Menu principal
          </ThemedText>
          {menuItems.map((item) => (
            <Pressable
              key={item.title}
              style={[styles.menuButton, { backgroundColor: cardBackground }]}
              onPress={() => router.push(item.route)}
            >
              <View style={styles.menuButtonLeft}>
                <View style={styles.iconContainer}>
                  <IconSymbol name={item.icon} size={20} color="#0a7ea4" />
                </View>
                <View style={styles.menuTextGroup}>
                  <ThemedText type="defaultSemiBold" style={styles.menuTitle}>
                    {item.title}
                  </ThemedText>
                  <ThemedText style={styles.menuDescription}>
                    {item.description}
                  </ThemedText>
                </View>
              </View>
              <IconSymbol name="chevron.right" size={20} color="#0a7ea4" />
            </Pressable>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: cardBackground }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Ações rápidas
          </ThemedText>
          <View style={styles.quickActions}>
            <Pressable
              style={styles.actionButton}
              onPress={() => router.push("/gestao-candidatos")}
            >
              <IconSymbol name="plus.circle.fill" size={22} color="#ffffff" />
              <ThemedText style={styles.actionLabel}>Novo registro</ThemedText>
            </Pressable>
            <Pressable
              style={styles.actionButton}
              onPress={() => router.push("/processos-seletivos")}
            >
              <IconSymbol name="calendar" size={22} color="#ffffff" />
              <ThemedText style={styles.actionLabel}>Agenda</ThemedText>
            </Pressable>
            <Pressable
              style={styles.actionButton}
              onPress={() => router.push("/avaliacoes")}
            >
              <IconSymbol name="chart.bar.fill" size={22} color="#ffffff" />
              <ThemedText style={styles.actionLabel}>Relatórios</ThemedText>
            </Pressable>
          </View>
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
  header: {
    marginBottom: 20,
  },
  pageHeader: {
    marginBottom: 18,
  },
  headerSubtitle: {
    marginTop: 8,
    color: "#475569",
  },
  logoutButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#0a7ea4",
  },
  logoutText: {
    color: "#ffffff",
  },
  section: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    padding: 16,
    marginBottom: 12,
  },
  menuButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#e0f2fe",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  menuTextGroup: {
    flex: 1,
  },
  menuTitle: {
    marginBottom: 6,
    fontSize: 16,
  },
  menuDescription: {
    color: "#64748b",
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: "#0a7ea4",
    minWidth: "30%",
    marginBottom: 12,
  },
  actionLabel: {
    color: "#ffffff",
    fontWeight: "600",
  },
});
