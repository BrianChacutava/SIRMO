import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import { BackButton } from "@/components/back-button";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Candidate, getAllCandidates, initDatabase } from "@/lib/db";

export default function GestaoCandidatosScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [candidatos, setCandidatos] = useState<Candidate[]>([]);
  const background = useThemeColor({ light: "#f8fafc" }, "background");
  const cardBackground = useThemeColor({ light: "#ffffff" }, "background");
  const isCompact = width < 700;

  const loadCandidates = useCallback(async () => {
    try {
      await initDatabase();
      const loaded = await getAllCandidates();
      setCandidatos(loaded);
    } catch (error) {
      console.error("Erro ao carregar candidatos", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCandidates();
    }, [loadCandidates]),
  );

  const formatDate = (value?: string) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = (name: string) => {
    const parts = name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2);

    return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
  };

  const renderCandidate = ({ item: candidato }: { item: Candidate }) => (
    <View
      style={[styles.candidatoCard, isCompact && styles.candidatoCardCompact]}
    >
      <View style={styles.candidatoIdentity}>
        <View style={styles.avatar}>
          <ThemedText style={styles.avatarText}>
            {getInitials(candidato.nome)}
          </ThemedText>
        </View>

        <View style={styles.candidatoInfo}>
          <ThemedText type="defaultSemiBold" numberOfLines={1}>
            {candidato.nome}
          </ThemedText>
          <ThemedText style={styles.status}>
            Documento: {candidato.documentoTipo} {candidato.documentoNumero}
          </ThemedText>
          <ThemedText style={styles.documentos}>CPF: {candidato.cpf}</ThemedText>
          <ThemedText style={styles.dateText}>
            Cadastro: {formatDate(candidato.createdAt)}
          </ThemedText>
        </View>
      </View>

      <View
        style={[styles.candidatoActions, isCompact && styles.candidatoActionsCompact]}
      >
        <Pressable
          style={styles.smallButton}
          onPress={() => router.push("./adicionar-documentos")}
        >
          <IconSymbol name="doc.text.fill" size={16} color="#0a7ea4" />
          <ThemedText style={styles.smallButtonLabel}>Documentos</ThemedText>
        </Pressable>
        <Pressable
          style={styles.smallButton}
          onPress={() => router.push("./status-selecao")}
        >
          <IconSymbol name="flag.fill" size={16} color="#0a7ea4" />
          <ThemedText style={styles.smallButtonLabel}>Status</ThemedText>
        </Pressable>
        <Pressable
          style={styles.smallButton}
          onPress={() => router.push("./documentacao")}
        >
          <IconSymbol name="doc.text.fill" size={16} color="#0a7ea4" />
          <ThemedText style={styles.smallButtonLabel}>Consulta</ThemedText>
        </Pressable>
      </View>
    </View>
  );

  return (
    <ThemedView style={[styles.page, { backgroundColor: background }]}>
      <FlatList
        contentContainerStyle={styles.content}
        data={candidatos}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <>
            <BackButton />
            <View style={styles.header}>
              <ThemedText type="title" style={styles.title}>
                Gestão de candidatos
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                Acompanhe o registro e os documentos dos candidatos.
              </ThemedText>
            </View>

            <View style={styles.actions}>
              <Pressable
                style={styles.actionButton}
                onPress={() => router.push("/novo-candidato")}
              >
                <IconSymbol name="plus.circle.fill" size={20} color="#ffffff" />
                <ThemedText style={styles.actionLabel}>Adicionar novo</ThemedText>
              </Pressable>
            </View>

            <View style={[styles.section, { backgroundColor: cardBackground }]}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Candidatos registrados
              </ThemedText>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={[styles.section, { backgroundColor: cardBackground }]}> 
            <ThemedText style={styles.emptyText}>
              Não há candidatos cadastrados ainda.
            </ThemedText>
          </View>
        }
        renderItem={renderCandidate}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
  title: {
    marginBottom: 8,
  },
  subtitle: {
    color: "#475569",
  },
  actions: {
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: "#0a7ea4",
    gap: 10,
  },
  actionLabel: {
    color: "#ffffff",
    fontWeight: "600",
  },
  section: {
    borderRadius: 24,
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  emptyText: {
    color: "#64748b",
    fontSize: 14,
    marginTop: 10,
  },
  candidatoCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 12,
  },
  candidatoInfo: {
    flex: 1,
  },
  status: {
    color: "#64748b",
    marginTop: 4,
  },
  documentos: {
    color: "#64748b",
    marginTop: 2,
  },
  candidatoActions: {
    flexDirection: "row",
    gap: 8,
  },
  smallButton: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#e0f2fe",
  },
  smallButtonLabel: {
    fontSize: 12,
    color: "#0a7ea4",
    marginTop: 4,
  },
});
