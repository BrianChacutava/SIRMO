import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function NovoCandidatoScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    dataNascimento: '',
  });

  const background = useThemeColor({ light: '#f8fafc', dark: '#0f172a' }, 'background');
  const cardBackground = useThemeColor({ light: '#ffffff', dark: '#111827' }, 'background');
  const inputBackground = useThemeColor({ light: '#f6f8fa', dark: '#111827' }, 'background');
  const inputBorder = useThemeColor({ light: '#d1d5db', dark: '#374151' }, 'background');

  const handleSubmit = () => {
    // Aqui seria implementada a lógica para salvar o candidato
    alert('Candidato cadastrado com sucesso!');
    router.back();
  };

  return (
    <ThemedView style={[styles.page, { backgroundColor: background }]}> 
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Novo candidato
        </ThemedText>
        <ThemedText style={styles.subtitle}>Preencha os dados do novo candidato.</ThemedText>

        <View style={[styles.form, { backgroundColor: cardBackground }]}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Nome completo</ThemedText>
            <TextInput
              value={formData.nome}
              onChangeText={(text) => setFormData({ ...formData, nome: text })}
              placeholder="Digite o nome completo"
              placeholderTextColor="#9ca3af"
              style={[styles.input, { backgroundColor: inputBackground, borderColor: inputBorder }]}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <TextInput
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="Digite o email"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.input, { backgroundColor: inputBackground, borderColor: inputBorder }]}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Telefone</ThemedText>
            <TextInput
              value={formData.telefone}
              onChangeText={(text) => setFormData({ ...formData, telefone: text })}
              placeholder="(11) 99999-9999"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
              style={[styles.input, { backgroundColor: inputBackground, borderColor: inputBorder }]}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>CPF</ThemedText>
            <TextInput
              value={formData.cpf}
              onChangeText={(text) => setFormData({ ...formData, cpf: text })}
              placeholder="000.000.000-00"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              style={[styles.input, { backgroundColor: inputBackground, borderColor: inputBorder }]}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Data de nascimento</ThemedText>
            <TextInput
              value={formData.dataNascimento}
              onChangeText={(text) => setFormData({ ...formData, dataNascimento: text })}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              style={[styles.input, { backgroundColor: inputBackground, borderColor: inputBorder }]}
            />
          </View>

          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <ThemedText type="defaultSemiBold" style={styles.submitLabel}>
              Cadastrar candidato
            </ThemedText>
          </Pressable>
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
  form: {
    borderRadius: 24,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    color: '#111827',
  },
  submitButton: {
    backgroundColor: '#0a7ea4',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitLabel: {
    color: '#fff',
    fontSize: 16,
  },
});
