import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

const documentos = [
  { nome: 'RG', status: 'Pendente', icone: 'person.text.rectangle.fill' },
  { nome: 'CPF', status: 'Enviado', icone: 'person.text.rectangle.fill' },
  { nome: 'Certificado de reservista', status: 'Pendente', icone: 'shield.fill' },
  { nome: 'Comprovante de residência', status: 'Aprovado', icone: 'house.fill' },
  { nome: 'Certidão negativa', status: 'Pendente', icone: 'doc.text.fill' },
];

export default function AdicionarDocumentosScreen() {
  const background = useThemeColor({ light: '#f8fafc', dark: '#0f172a' }, 'background');
  const cardBackground = useThemeColor({ light: '#ffffff', dark: '#111827' }, 'background');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado': return '#10b981';
      case 'Enviado': return '#f59e0b';
      case 'Pendente': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <ThemedView style={[styles.page, { backgroundColor: background }]}> 
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Adicionar documentos
        </ThemedText>
        <ThemedText style={styles.subtitle}>Envie os documentos necessários para o processo de recrutamento.</ThemedText>

        <View style={[styles.section, { backgroundColor: cardBackground }]}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Documentos obrigatórios</ThemedText>
          {documentos.map((doc, index) => (
            <View key={index} style={styles.documentoCard}>
              <View style={styles.documentoInfo}>
                <View style={styles.documentoIcon}>
                  <IconSymbol name={doc.icone} size={20} color="#0a7ea4" />
                </View>
                <View style={styles.documentoText}>
                  <ThemedText type="defaultSemiBold">{doc.nome}</ThemedText>
                  <ThemedText style={[styles.status, { color: getStatusColor(doc.status) }]}>
                    {doc.status}
                  </ThemedText>
                </View>
              </View>
              <Pressable style={styles.uploadButton}>
                <IconSymbol name="arrow.up.doc.fill" size={16} color="#ffffff" />
                <ThemedText style={styles.uploadLabel}>Enviar</ThemedText>
              </Pressable>
            </View>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: cardBackground }]}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>Orientações</ThemedText>
          <ThemedText style={styles.infoText}>• Digitalize os documentos em boa qualidade</ThemedText>
          <ThemedText style={styles.infoText}>• Arquivos devem estar no formato PDF ou JPG</ThemedText>
          <ThemedText style={styles.infoText}>• Tamanho máximo: 5MB por arquivo</ThemedText>
          <ThemedText style={styles.infoText}>• Verifique se todos os dados estão legíveis</ThemedText>
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
  section: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  documentoCard: {
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
  documentoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  documentoText: {
    flex: 1,
  },
  status: {
    marginTop: 4,
    fontSize: 14,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#0a7ea4',
    gap: 6,
  },
  uploadLabel: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoText: {
    marginBottom: 8,
    color: '#475569',
  },
});
