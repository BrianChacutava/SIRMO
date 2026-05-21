import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { BackButton } from "@/components/back-button";
import * as ImagePicker from "expo-image-picker";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { insertCandidate, insertDocument, initDatabase } from "@/lib/db";

const documentTypes = ["RG", "CPF", "CNH", "Passaporte"];

export default function NovoCandidatoScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    dataNascimento: "",
    documentoTipo: "RG",
    documentoNumero: "",
    documentoFotoUri: "",
  });

  const background = useThemeColor({ light: "#f8fafc" }, "background");
  const cardBackground = useThemeColor({ light: "#ffffff" }, "background");
  const inputBackground = useThemeColor({ light: "#f6f8fa" }, "background");
  const inputBorder = useThemeColor({ light: "#d1d5db" }, "background");

  useEffect(() => {
    initDatabase().catch((error) => console.error("Erro ao inicializar DB", error));
  }, []);

  const autoFillDocumentData = (uri: string) => {
    const updates: Partial<typeof formData> = { documentoFotoUri: uri };

    if (formData.documentoTipo === "RG") {
      updates.documentoNumero = "12.345.678-9";
      if (!formData.cpf) updates.cpf = "123.456.789-00";
      if (!formData.dataNascimento) updates.dataNascimento = "01/01/1990";
    }

    if (formData.documentoTipo === "CPF") {
      updates.cpf = "123.456.789-00";
      if (!formData.documentoNumero) updates.documentoNumero = "000000000";
    }

    if (formData.documentoTipo === "CNH") {
      updates.documentoNumero = "ABC123456";
      if (!formData.cpf) updates.cpf = "123.456.789-00";
    }

    if (formData.documentoTipo === "Passaporte") {
      updates.documentoNumero = "BR1234567";
      if (!formData.cpf) updates.cpf = "123.456.789-00";
    }

    setFormData((current) => ({ ...current, ...updates }));
  };

  const pickDocumentPhoto = async () => {
    const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!libraryPermission.granted) {
      alert("Permissão de acesso à galeria foi negada.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (result.canceled || result.assets.length === 0) return;
    autoFillDocumentData(result.assets[0].uri);
  };

  const takeDocumentPhoto = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (!cameraPermission.granted) {
      alert("Permissão para câmera negada.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (result.canceled || result.assets.length === 0) return;
    autoFillDocumentData(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    if (
      !formData.nome ||
      !formData.email ||
      !formData.telefone ||
      !formData.cpf ||
      !formData.dataNascimento ||
      !formData.documentoNumero
    ) {
      alert("Preencha todos os campos obrigatórios antes de salvar.");
      return;
    }

    try {
      await initDatabase();
      const candidateId = await insertCandidate({
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        cpf: formData.cpf,
        dataNascimento: formData.dataNascimento,
        documentoTipo: formData.documentoTipo,
        documentoNumero: formData.documentoNumero,
        documentoFotoUri: formData.documentoFotoUri,
      });

      if (formData.documentoFotoUri) {
        await insertDocument({
          candidateId,
          tipo: formData.documentoTipo,
          status: "Enviado",
          uri: formData.documentoFotoUri,
        });
      }

      alert("Cadastro salvo com sucesso na base SQLite.");
      router.back();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar candidato. Tente novamente.");
    }
  };

  return (
    <ThemedView style={[styles.page, { backgroundColor: background }]}> 
      <ScrollView contentContainerStyle={styles.content}>
        <BackButton />
        <ThemedText type="title" style={styles.title}>
          Novo candidato
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Cadastre o candidato usando o documento de identidade e foto do documento.
        </ThemedText>

        <View style={[styles.form, { backgroundColor: cardBackground }]}> 
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Tipo de documento</ThemedText>
            <View style={styles.typeRow}>
              {documentTypes.map((type) => (
                <Pressable
                  key={type}
                  style={[
                    styles.documentTypeButton,
                    formData.documentoTipo === type && styles.documentTypeActive,
                  ]}
                  onPress={() => setFormData({ ...formData, documentoTipo: type })}
                >
                  <ThemedText
                    style={
                      formData.documentoTipo === type
                        ? styles.documentTypeTextActive
                        : styles.documentTypeText
                    }
                  >
                    {type}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Nome completo</ThemedText>
            <TextInput
              value={formData.nome}
              onChangeText={(text) => setFormData({ ...formData, nome: text })}
              placeholder="Digite o nome completo"
              placeholderTextColor="#9ca3af"
              style={[
                styles.input,
                { backgroundColor: inputBackground, borderColor: inputBorder },
              ]}
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
              style={[
                styles.input,
                { backgroundColor: inputBackground, borderColor: inputBorder },
              ]}
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
              style={[
                styles.input,
                { backgroundColor: inputBackground, borderColor: inputBorder },
              ]}
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
              style={[
                styles.input,
                { backgroundColor: inputBackground, borderColor: inputBorder },
              ]}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Número do documento</ThemedText>
            <TextInput
              value={formData.documentoNumero}
              onChangeText={(text) => setFormData({ ...formData, documentoNumero: text })}
              placeholder="Número do documento"
              placeholderTextColor="#9ca3af"
              style={[
                styles.input,
                { backgroundColor: inputBackground, borderColor: inputBorder },
              ]}
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
              style={[
                styles.input,
                { backgroundColor: inputBackground, borderColor: inputBorder },
              ]}
            />
          </View>

          <View style={styles.documentActions}>
            <Pressable style={styles.documentButton} onPress={pickDocumentPhoto}>
              <ThemedText style={styles.documentButtonText}>Selecionar foto</ThemedText>
            </Pressable>
            <Pressable style={styles.documentButton} onPress={takeDocumentPhoto}>
              <ThemedText style={styles.documentButtonText}>Tirar foto</ThemedText>
            </Pressable>
          </View>

          {formData.documentoFotoUri ? (
            <Image
              source={{ uri: formData.documentoFotoUri }}
              style={styles.documentPreview}
              resizeMode="cover"
            />
          ) : null}

          <Pressable style={styles.submitButton} onPress={handleSubmit}>
            <ThemedText type="defaultSemiBold" style={styles.submitLabel}>
              Salvar na base SQLite
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
    color: "#475569",
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
    fontWeight: "600",
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    color: "#111827",
  },
  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  documentTypeButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#f8fafc",
    marginBottom: 10,
  },
  documentTypeActive: {
    backgroundColor: "#0a7ea4",
    borderColor: "#0a7ea4",
  },
  documentTypeText: {
    color: "#0f172a",
  },
  documentTypeTextActive: {
    color: "#ffffff",
    fontWeight: "700",
  },
  documentActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 18,
  },
  documentButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    backgroundColor: "#0a7ea4",
    alignItems: "center",
  },
  documentButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  documentPreview: {
    width: "100%",
    height: 200,
    borderRadius: 18,
    marginBottom: 18,
  },
  submitButton: {
    backgroundColor: "#0a7ea4",
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  submitLabel: {
    color: "#fff",
    fontSize: 16,
  },
});

