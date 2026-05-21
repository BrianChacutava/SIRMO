import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { BackButton } from "@/components/back-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function CadastroScreen() {
  const router = useRouter();
  const background = useThemeColor({ light: "#f8fafc" }, "background");
  const cardBackground = useThemeColor({ light: "#ffffff" }, "background");

  return (
    <ThemedView style={[styles.page, { backgroundColor: background }]}> 
      <ScrollView contentContainerStyle={styles.content}>
        <BackButton />
        <ThemedText type="title" style={styles.title}>
          Cadastro
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Registre candidatos com base em documentos de identidade e mantenha os dados em SQLite.
        </ThemedText>

        <View style={[styles.card, { backgroundColor: cardBackground }]}> 
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Cadastro por documento
          </ThemedText>
          <ThemedText style={styles.cardDescription}>
            Faça o cadastro do candidato incluindo foto do documento e pré-preenchimento automático.
          </ThemedText>

          <Pressable style={styles.primaryButton} onPress={() => router.push("./novo-candidato")}> 
            <ThemedText type="defaultSemiBold" style={styles.primaryLabel}>
              Cadastrar novo candidato
            </ThemedText>
          </Pressable>

          <View style={styles.infoItem}>
            <ThemedText type="defaultSemiBold">Como funciona</ThemedText>
            <ThemedText style={styles.infoText}>
              1. Preencha os dados do candidato 2. Faça upload ou tire foto do documento 3. Os campos são preenchidos automaticamente 4. Salve na base SQLite
            </ThemedText>
          </View>

          <View style={styles.infoItem}>
            <ThemedText type="defaultSemiBold">Status do cadastro</ThemedText>
            <ThemedText style={styles.infoText}>
              Os cadastros já realizados ficam disponíveis na gestão de candidatos.
            </ThemedText>
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
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 20,
    color: "#475569",
  },
  card: {
    borderRadius: 24,
    padding: 20,
  },
  cardTitle: {
    marginBottom: 10,
  },
  cardDescription: {
    marginBottom: 18,
    color: "#475569",
  },
  primaryButton: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#0a7ea4",
    justifyContent: "center",
    alignItems: "center",
  },
  primaryLabel: {
    color: "#ffffff",
    fontSize: 16,
  },
  infoItem: {
    marginTop: 18,
  },
  infoText: {
    marginTop: 6,
    color: "#64748b",
  },
});
