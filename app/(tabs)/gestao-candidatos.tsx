import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

const candidatos = [
  { id: 1, nome: 'João Silva', status: 'Em análise', documentos: 'Pendente' },
  { id: 2, nome: 'Maria Santos', status: 'Aprovado', documentos: 'Completo' },
  { id: 3, nome: 'Pedro Oliveira', status: 'Reprovado', documentos: 'Incompleto' },
];

export default function GestaoCandidatosScreen() {
  const router = useRouter();
  const background = useThemeColor({ light: '#f8fafc', dark: '#0f172a' }, 'background');
  const cardBackground = useThemeColor({ light: '#ffffff', dark: '#111827' }, 'background');

  return (
    <ThemedView style={[styles.page, { backgroundColor: background }]}> 
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Gestão de candidatos
          </ThemedText>
          <ThemedText style={styles.subtitle}>Acompanhe o registro, entrevista e aprovação dos candidatos.</ThemedText>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.actionButton} onPress={() => router.push('/novo-candidato')}>
            <IconSymbol name="plus.circle.fill" size={20} color="#ffffff" />
            <ThemedText style={styles.actionLabel}>Adicionar novo</ThemedText>
          </Pressable>
        </View>

        <View style={[styles.section, { backgroundColor: cardBackground }]}> 
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Candidatos registrados</ThemedText>
          {candidatos.map((candidato) => (
            <View key={candidato.id} style={styles.candidatoCard}>
              <View style={styles.candidatoInfo}>
                <ThemedText type="defaultSemiBold">{candidato.nome}</ThemedText>
                <ThemedText style={styles.status}>Status: {candidato.status}</ThemedText>
                <ThemedText style={styles.documentos}>Documentos: {candidato.documentos}</ThemedText>
              </View>
              <View style={styles.candidatoActions}>
                <Pressable style={styles.smallButton} onPress={() => router.push('/adicionar-documentos')}>
                  <IconSymbol name="doc.text.fill" size={16} color="#0a7ea4" />
                  <ThemedText style={styles.smallButtonLabel}>Documentos</ThemedText>
                </Pressable>
                <Pressable style={styles.smallButton} onPress={() => router.push('/status-selecao')}>
                  <IconSymbol name="flag.fill" size={16} color="#0a7ea4" />
                  <ThemedText style={styles.smallButtonLabel}>Status</ThemedText>
                </Pressable>
                <Pressable style={styles.smallButton} onPress={() => router.push('/documentacao')}>
                  <IconSymbol name="doc.text.fill" size={16} color="#0a7ea4" />
                  <ThemedText style={styles.smallButtonLabel}>Consulta</ThemedText>
                </Pressable>
              </View>
            </View>
          ))}
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
  title: {
    marginBottom: 8,
  },
  subtitle: {
    color: '#475569',
  },
  actions: {
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: '#0a7ea4',
    gap: 10,
  },
  actionLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
  section: {
    borderRadius: 24,
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  candidatoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  candidatoInfo: {
    flex: 1,
  },
  status: {
    color: '#64748b',
    marginTop: 4,
  },
  documentos: {
    color: '#64748b',
    marginTop: 2,
  },
  candidatoActions: {
    flexDirection: 'row',
    gap: 8,
  },
  smallButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#e0f2fe',
  },
  smallButtonLabel: {
    fontSize: 12,
    color: '#0a7ea4',
    marginTop: 4,
  },
});
