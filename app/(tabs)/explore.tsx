import { useRouter } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";

const menuData = [
  {
    title: "Gestão de candidatos",
    items: ["Cadastrar candidato", "Lista de candidatos", "Acompanhar status"],
  },
  {
    title: "Processos seletivos",
    items: ["Abrir nova vaga", "Vagas ativas", "Histórico de seleção"],
  },
  {
    title: "Avaliações",
    items: ["Agendar exame", "Resultados", "Relatórios de desempenho"],
  },
  {
    title: "Documentação",
    items: [
      "Enviar documentos",
      "Verificar pendências",
      "Imprimir comprovantes",
    ],
  },
  {
    title: "Comunicação",
    items: ["Notificações", "Mensagens", "Avisos oficiais"],
  },
];

export default function TabTwoScreen() {
  const router = useRouter();
  const sectionBackground = useThemeColor(
    { light: "#eef2ff", dark: "#1f2937" },
    "background",
  );
  const buttonBackground = useThemeColor(
    { light: "#ffffff", dark: "#111827" },
    "background",
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#dbeafe", dark: "#111827" }}
      headerImage={
        <IconSymbol
          size={260}
          color="#4f46e5"
          name="shield.lefthalf.fill"
          style={styles.headerImage}
        />
      }
    >
      <View style={styles.topBar}>
        <ThemedText type="title" style={styles.title}>
          Recrutamento Militar
        </ThemedText>
        <Pressable
          style={styles.logoutButton}
          onPress={() => router.replace("/login")}
        >
          <ThemedText type="defaultSemiBold" style={styles.logoutLabel}>
            Logout
          </ThemedText>
        </Pressable>
      </View>
      <ThemedText style={styles.subtitle}>
        Sistema de recrutamento militar online
      </ThemedText>

      <View style={[styles.section, { backgroundColor: sectionBackground }]}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Menu Principal
        </ThemedText>
        {menuData.map((menu) => (
          <View key={menu.title} style={styles.menuBlock}>
            <ThemedText type="defaultSemiBold" style={styles.menuTitle}>
              {menu.title}
            </ThemedText>
            <View style={styles.submenuList}>
              {menu.items.map((item) => (
                <Pressable
                  key={item}
                  style={[
                    styles.menuButton,
                    { backgroundColor: buttonBackground },
                  ]}
                >
                  <ThemedText style={styles.menuButtonLabel}>{item}</ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.section, { backgroundColor: sectionBackground }]}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Ações rápidas
        </ThemedText>
        <View style={styles.quickActions}>
          <Pressable style={styles.quickActionButton}>
            <ThemedText style={styles.quickActionLabel}>
              Novo Registro
            </ThemedText>
          </Pressable>
          <Pressable style={styles.quickActionButton}>
            <ThemedText style={styles.quickActionLabel}>
              Agenda de Exames
            </ThemedText>
          </Pressable>
          <Pressable style={styles.quickActionButton}>
            <ThemedText style={styles.quickActionLabel}>Relatórios</ThemedText>
          </Pressable>
        </View>
      </View>

      <ThemedText style={styles.footerText}>
        Use os botões acima para navegar pelos principais módulos do sistema e
        pressione Logout para voltar à tela de login.
      </ThemedText>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#4f46e5",
    bottom: -60,
    left: -30,
    position: "absolute",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontFamily: Fonts.rounded,
  },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#0a7ea4",
  },
  logoutLabel: {
    color: "#ffffff",
  },
  subtitle: {
    marginBottom: 20,
    color: "#475569",
  },
  section: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  menuBlock: {
    marginBottom: 18,
  },
  menuTitle: {
    marginBottom: 10,
    fontSize: 18,
  },
  submenuList: {
    gap: 12,
  },
  menuButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  menuButtonLabel: {
    fontSize: 16,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    minWidth: 110,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#0a7ea4",
    alignItems: "center",
  },
  quickActionLabel: {
    color: "#ffffff",
    fontWeight: "600",
  },
  footerText: {
    marginTop: 8,
    color: "#475569",
  },
});
