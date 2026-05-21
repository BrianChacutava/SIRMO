import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { BackButton } from "@/components/back-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";

const actions = [
  { title: "Cadastro", route: "./cadastro", icon: "person.crop.circle.fill" },
  {
    title: "Recrutamento",
    route: "./recrutamento",
    icon: "shield.lefthalf.fill",
  },
  { title: "Configurações", route: "./configuracoes", icon: "gearshape.fill" },
] as const;

export default function HomeScreen() {
  const router = useRouter();
  const background = useThemeColor(
    { light: "#f0f9ff", dark: "#111827" },
    "background",
  );
  const cardBackground = useThemeColor(
    { light: "#ffffff", dark: "#1f2937" },
    "background",
  );

  return (
    <ThemedView style={[styles.page, { backgroundColor: background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <BackButton />
        <View style={styles.header}>
          <Pressable
            style={styles.logoutButton}
            onPress={() => router.replace("/login")}
          >
            <IconSymbol
              name="arrow.right.square.fill"
              size={20}
              color="#ffffff"
            />
            <ThemedText style={styles.logoutLabel}>Logout</ThemedText>
          </Pressable>
        </View>

        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/sirmo.png")}
            style={styles.logo}
            contentFit="contain"
          />
        </View>

        <View style={[styles.card, { backgroundColor: cardBackground }]}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Etapas do recrutamento militar
          </ThemedText>
          <View style={styles.etapaItem}>
            <ThemedText type="defaultSemiBold" style={styles.etapaNumber}>
              1
            </ThemedText>
            <ThemedText style={styles.etapaText}>
              Inscrição online e envio de documentos
            </ThemedText>
          </View>
          <View style={styles.etapaItem}>
            <ThemedText type="defaultSemiBold" style={styles.etapaNumber}>
              2
            </ThemedText>
            <ThemedText style={styles.etapaText}>
              Análise documental e verificação
            </ThemedText>
          </View>
          <View style={styles.etapaItem}>
            <ThemedText type="defaultSemiBold" style={styles.etapaNumber}>
              3
            </ThemedText>
            <ThemedText style={styles.etapaText}>
              Exame médico e odontológico
            </ThemedText>
          </View>
          <View style={styles.etapaItem}>
            <ThemedText type="defaultSemiBold" style={styles.etapaNumber}>
              4
            </ThemedText>
            <ThemedText style={styles.etapaText}>
              Teste de aptidão física
            </ThemedText>
          </View>
          <View style={styles.etapaItem}>
            <ThemedText type="defaultSemiBold" style={styles.etapaNumber}>
              5
            </ThemedText>
            <ThemedText style={styles.etapaText}>
              Entrevista e avaliação psicológica
            </ThemedText>
          </View>
          <View style={styles.etapaItem}>
            <ThemedText type="defaultSemiBold" style={styles.etapaNumber}>
              6
            </ThemedText>
            <ThemedText style={styles.etapaText}>
              Incorporação ao serviço militar
            </ThemedText>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: cardBackground }]}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Requisitos básicos
          </ThemedText>
          <ThemedText style={styles.requisitoText}>
            • Idade entre 18 e 45 anos
          </ThemedText>
          <ThemedText style={styles.requisitoText}>
            • Ensino médio completo
          </ThemedText>
          <ThemedText style={styles.requisitoText}>
            • Boa saúde física e mental
          </ThemedText>
          <ThemedText style={styles.requisitoText}>
            • Não possuir antecedentes criminais
          </ThemedText>
          <ThemedText style={styles.requisitoText}>
            • Nacionalidade brasileira
          </ThemedText>
          <ThemedText style={styles.requisitoText}>
            • Aptidão para o serviço militar
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Ações rápidas
          </ThemedText>
          <View style={styles.actionsGrid}>
            {actions.map((action) => (
              <Pressable
                key={action.title}
                style={[styles.actionCard, { backgroundColor: cardBackground }]}
                onPress={() => router.push(action.route)}
              >
                <View style={styles.actionIcon}>
                  <IconSymbol name={action.icon} size={20} color="#0a7ea4" />
                </View>
                <ThemedText type="defaultSemiBold" style={styles.actionLabel}>
                  {action.title}
                </ThemedText>
              </Pressable>
            ))}
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
    alignItems: "flex-end",
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#0a7ea4",
    gap: 8,
  },
  logoutLabel: {
    color: "#ffffff",
    fontWeight: "600",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 150,
    height: 150,
  },
  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardTitle: {
    marginBottom: 16,
  },
  etapaItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  etapaNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0a7ea4",
    color: "#ffffff",
    textAlign: "center",
    textAlignVertical: "center",
    marginRight: 12,
    fontSize: 14,
  },
  etapaText: {
    flex: 1,
    color: "#475569",
  },
  requisitoText: {
    marginBottom: 8,
    color: "#475569",
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    marginBottom: 14,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  actionCard: {
    width: "48%",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#e0f2fe",
    justifyContent: "center",
    alignItems: "center",
  },
  actionLabel: {
    flex: 1,
  },
});
