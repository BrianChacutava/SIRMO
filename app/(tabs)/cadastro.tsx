import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function CadastroScreen() {
  const background = useThemeColor({ light: '#f8fafc', dark: '#0f172a' }, 'background');
  const cardBackground = useThemeColor({ light: '#ffffff', dark: '#111827' }, 'background');

  return (
    <ThemedView style={[styles.page, { backgroundColor: background }]}> 
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Cadastro
        </ThemedText>
        <ThemedText style={styles.subtitle}>Formulário de cadastro disponível para novos candidatos e colaboradores.</ThemedText>

        <View style={[styles.card, { backgroundColor: cardBackground }]}> 
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Novo cadastro
          </ThemedText>
          <ThemedText style={styles.cardDescription}>
            Neste módulo você poderá registrar informações básicas do candidato, documentos e status de admissão.
          </ThemedText>
          <View style={styles.infoItem}>
            <ThemedText type="defaultSemiBold">Passos do cadastro</ThemedText>
            <ThemedText style={styles.infoText}>1. Dados pessoais 2. Documentação 3. Avaliação médica 4. Aprovação</ThemedText>
          </View>
          <View style={styles.infoItem}>
            <ThemedText type="defaultSemiBold">Recomendações</ThemedText>
            <ThemedText style={styles.infoText}>Confirme todos os campos antes de enviar para evitar retrabalho.</ThemedText>
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
    color: '#475569',
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
    color: '#475569',
  },
  infoItem: {
    marginBottom: 16,
  },
  infoText: {
    marginTop: 6,
    color: '#64748b',
  },
});
