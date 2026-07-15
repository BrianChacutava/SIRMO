import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

import { BackButton } from "@/components/back-button";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { initDatabase, insertCandidate, insertDocument } from "@/lib/db";

declare const process: { env?: Record<string, string | undefined> };

const documentTypes = ["BI", "Passaporte", "Carta de Condução", "NUIT"];
const aiApiKey = process.env?.EXPO_PUBLIC_OPENAI_API_KEY ?? "";
const aiEndpoint =
  process.env?.EXPO_PUBLIC_AI_ENDPOINT ??
  "https://api.openai.com/v1/chat/completions";
const aiModel = process.env?.EXPO_PUBLIC_AI_MODEL ?? "gpt-4.1-mini";

export default function NovoCandidatoScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    dataNascimento: "",
    documentoTipo: "BI",
    documentoNumero: "",
    documentoFotoUri: "",
    naturalidade: "",
    enderecoResidencial: "",
    sexo: "",
    altura: "",
  });
  const [fillMode, setFillMode] = useState<"automatic" | "manual">("automatic");
  const [extractionHint, setExtractionHint] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const background = useThemeColor({ light: "#f8fafc" }, "background");
  const cardBackground = useThemeColor({ light: "#ffffff" }, "background");
  const inputBackground = useThemeColor({ light: "#f6f8fa" }, "background");
  const inputBorder = useThemeColor({ light: "#d1d5db" }, "background");

  useEffect(() => {
    initDatabase().catch((error) =>
      console.error("Erro ao inicializar DB", error),
    );
  }, []);

  const getSuggestedProfile = (documentType: string) => {
    switch (documentType) {
      case "BI":
        return {
          nome: "Maria João Machel",
          documentoNumero: "1234567890",
          cpf: "12345678910",
          dataNascimento: "01/01/1990",
          naturalidade: "Maputo, Moçambique",
          enderecoResidencial: "Rua da Liberdade, 123 - Maputo",
          sexo: "Feminino",
          altura: "1,68 m",
        };
      case "Passaporte":
        return {
          nome: "José Manuel Nhamire",
          documentoNumero: "P1234567",
          cpf: "12345678910",
          dataNascimento: "15/04/1988",
          naturalidade: "Nampula, Moçambique",
          enderecoResidencial: "Av. 25 de Setembro, 456 - Nampula",
          sexo: "Masculino",
          altura: "1,80 m",
        };
      case "Carta de Condução":
        return {
          nome: "Rafael Alberto Chissano",
          documentoNumero: "CC123456",
          cpf: "12345678910",
          dataNascimento: "22/09/1994",
          naturalidade: "Beira, Moçambique",
          enderecoResidencial: "Rua do Comercio, 89 - Beira",
          sexo: "Masculino",
          altura: "1,76 m",
        };
      case "NUIT":
        return {
          nome: "Anita de Sousa",
          documentoNumero: "NUIT123456789",
          cpf: "12345678910",
          dataNascimento: "07/03/1992",
          naturalidade: "Xai-Xai, Moçambique",
          enderecoResidencial: "Av. 4 de Outubro, 303 - Xai-Xai",
          sexo: "Feminino",
          altura: "1,70 m",
        };
      default:
        return {
          nome: "",
          documentoNumero: "",
          cpf: "",
          dataNascimento: "",
          naturalidade: "",
          enderecoResidencial: "",
          sexo: "",
          altura: "",
        };
    }
  };

  const parseAiExtraction = (content: string) => {
    const cleaned = content.replace(/```json|```/g, "").trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) return null;

      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
  };

  const extractDocumentDataWithAI = async (
    imageBase64: string,
    mimeType: string,
    documentType: string,
  ) => {
    if (!aiApiKey) {
      return null;
    }

    const response = await fetch(aiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aiApiKey}`,
      },
      body: JSON.stringify({
        model: aiModel,
        messages: [
          {
            role: "system",
            content:
              "Você é um assistente especializado em leitura de documentos de identificação. Retorne apenas um JSON válido com os campos nome, documentoNumero, cpf, dataNascimento, naturalidade, enderecoResidencial, sexo e altura. Se algum valor não for encontrado, use string vazia.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analise esta imagem de um documento ${documentType} de Moçambique. Retorne um JSON com os dados pessoais do titular.`,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      throw new Error("Não foi possível ler o documento com IA.");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (typeof content !== "string") {
      throw new Error("Resposta de IA inválida.");
    }

    return parseAiExtraction(content);
  };

  const handleDocumentImageSelected = async (
    uri: string,
    base64?: string,
    mimeType?: string,
  ) => {
    if (fillMode === "manual") {
      setExtractionHint(
        "Modo manual ativado. Você pode preencher os dados manualmente.",
      );
      setFormData((current) => ({ ...current, documentoFotoUri: uri }));
      return;
    }

    setFormData((current) => ({ ...current, documentoFotoUri: uri }));
    setExtractionHint("Lendo documento com IA...");
    setIsAnalyzing(true);

    try {
      const currentType = formData.documentoTipo;
      const suggestedProfile = getSuggestedProfile(currentType);
      const aiData = base64
        ? await extractDocumentDataWithAI(
            base64,
            mimeType ?? "image/jpeg",
            currentType,
          )
        : null;
      const mergedData = {
        ...suggestedProfile,
        ...(aiData ?? {}),
      };

      setFormData((current) => ({
        ...current,
        documentoFotoUri: uri,
        nome: current.nome || mergedData.nome || "",
        documentoNumero:
          current.documentoNumero || mergedData.documentoNumero || "",
        cpf: current.cpf || mergedData.cpf || "",
        dataNascimento:
          current.dataNascimento || mergedData.dataNascimento || "",
        naturalidade: current.naturalidade || mergedData.naturalidade || "",
        enderecoResidencial:
          current.enderecoResidencial || mergedData.enderecoResidencial || "",
        sexo: current.sexo || mergedData.sexo || "",
        altura: current.altura || mergedData.altura || "",
      }));

      setExtractionHint(
        aiData
          ? "Dados lidos com IA e preenchidos automaticamente. Você pode editar tudo manualmente."
          : aiApiKey
            ? "A IA não retornou um JSON válido. Os dados locais foram usados como sugestão."
            : "Configure EXPO_PUBLIC_OPENAI_API_KEY para usar a leitura automática por IA.",
      );
    } catch {
      const fallbackProfile = getSuggestedProfile(formData.documentoTipo);
      setFormData((current) => ({
        ...current,
        documentoFotoUri: uri,
        nome: current.nome || fallbackProfile.nome,
        documentoNumero:
          current.documentoNumero || fallbackProfile.documentoNumero,
        cpf: current.cpf || fallbackProfile.cpf,
        dataNascimento:
          current.dataNascimento || fallbackProfile.dataNascimento,
        naturalidade: current.naturalidade || fallbackProfile.naturalidade,
        enderecoResidencial:
          current.enderecoResidencial || fallbackProfile.enderecoResidencial,
        sexo: current.sexo || fallbackProfile.sexo,
        altura: current.altura || fallbackProfile.altura,
      }));
      setExtractionHint(
        "A leitura por IA não foi concluída. Foram aplicadas sugestões locais.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const pickDocumentPhoto = async () => {
    try {
      const requestPermission =
        ImagePicker.requestMediaLibraryPermissionsAsync as
          | ((...args: unknown[]) => Promise<{ granted?: boolean }>)
          | undefined;
      if (requestPermission) {
        const libraryPermission = await requestPermission();
        if (!libraryPermission.granted) {
          alert("Permissão de acesso à galeria foi negada.");
          return;
        }
      }

      const launchLibrary = ImagePicker.launchImageLibraryAsync as
        | ((
            options?: Record<string, unknown>,
          ) => Promise<{
            canceled?: boolean;
            assets?: { uri?: string; base64?: string; mimeType?: string }[];
          }>)
        | undefined;
      if (!launchLibrary) {
        alert("A seleção de imagem não está disponível nesta plataforma.");
        return;
      }

      const result = await launchLibrary({
        quality: 0.8,
        base64: true,
      });

      if (result.canceled || !result.assets?.length) return;
      const asset = result.assets[0];
      await handleDocumentImageSelected(
        asset.uri ?? "",
        asset.base64,
        asset.mimeType,
      );
    } catch {
      alert("Não foi possível abrir a galeria. Tente novamente.");
    }
  };

  const takeDocumentPhoto = async () => {
    try {
      const requestPermission = ImagePicker.requestCameraPermissionsAsync as
        | ((...args: unknown[]) => Promise<{ granted?: boolean }>)
        | undefined;
      if (requestPermission) {
        const cameraPermission = await requestPermission();
        if (!cameraPermission.granted) {
          alert("Permissão para câmera negada.");
          return;
        }
      }

      const launchCamera = ImagePicker.launchCameraAsync as
        | ((
            options?: Record<string, unknown>,
          ) => Promise<{
            canceled?: boolean;
            assets?: { uri?: string; base64?: string; mimeType?: string }[];
          }>)
        | undefined;
      if (!launchCamera) {
        alert("A câmera não está disponível nesta plataforma.");
        return;
      }

      const result = await launchCamera({
        quality: 0.8,
        base64: true,
      });

      if (result.canceled || !result.assets?.length) return;
      const asset = result.assets[0];
      await handleDocumentImageSelected(
        asset.uri ?? "",
        asset.base64,
        asset.mimeType,
      );
    } catch {
      alert("Não foi possível abrir a câmera. Tente novamente.");
    }
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
        naturalidade: formData.naturalidade,
        enderecoResidencial: formData.enderecoResidencial,
        sexo: formData.sexo,
        altura: formData.altura,
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
          Cadastre o candidato usando a foto do documento e preencha os dados
          automaticamente para Moçambique. Você também pode editar tudo
          manualmente.
        </ThemedText>

        <View style={[styles.form, { backgroundColor: cardBackground }]}>
          <View style={styles.modeRow}>
            <Pressable
              style={[
                styles.modeButton,
                fillMode === "automatic" && styles.modeButtonActive,
              ]}
              onPress={() => setFillMode("automatic")}
            >
              <ThemedText
                style={
                  fillMode === "automatic"
                    ? styles.modeButtonTextActive
                    : styles.modeButtonText
                }
              >
                Preenchimento automático
              </ThemedText>
            </Pressable>
            <Pressable
              style={[
                styles.modeButton,
                fillMode === "manual" && styles.modeButtonActive,
              ]}
              onPress={() => setFillMode("manual")}
            >
              <ThemedText
                style={
                  fillMode === "manual"
                    ? styles.modeButtonTextActive
                    : styles.modeButtonText
                }
              >
                Inserir manualmente
              </ThemedText>
            </Pressable>
          </View>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Tipo de documento</ThemedText>
            <View style={styles.typeRow}>
              {documentTypes.map((type) => (
                <Pressable
                  key={type}
                  style={[
                    styles.documentTypeButton,
                    formData.documentoTipo === type &&
                      styles.documentTypeActive,
                  ]}
                  onPress={() =>
                    setFormData({ ...formData, documentoTipo: type })
                  }
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
              onChangeText={(text) =>
                setFormData({ ...formData, telefone: text })
              }
              placeholder="+258 84 000 0000"
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
              onChangeText={(text) =>
                setFormData({ ...formData, documentoNumero: text })
              }
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
              onChangeText={(text) =>
                setFormData({ ...formData, dataNascimento: text })
              }
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              style={[
                styles.input,
                { backgroundColor: inputBackground, borderColor: inputBorder },
              ]}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Naturalidade</ThemedText>
            <TextInput
              value={formData.naturalidade}
              onChangeText={(text) =>
                setFormData({ ...formData, naturalidade: text })
              }
              placeholder="Maputo, Moçambique"
              placeholderTextColor="#9ca3af"
              style={[
                styles.input,
                { backgroundColor: inputBackground, borderColor: inputBorder },
              ]}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Endereço residencial</ThemedText>
            <TextInput
              value={formData.enderecoResidencial}
              onChangeText={(text) =>
                setFormData({ ...formData, enderecoResidencial: text })
              }
              placeholder="Rua/Av., bairro, cidade, província"
              placeholderTextColor="#9ca3af"
              style={[
                styles.input,
                { backgroundColor: inputBackground, borderColor: inputBorder },
              ]}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Sexo</ThemedText>
            <TextInput
              value={formData.sexo}
              onChangeText={(text) => setFormData({ ...formData, sexo: text })}
              placeholder="Masculino, Feminino ou Outro"
              placeholderTextColor="#9ca3af"
              style={[
                styles.input,
                { backgroundColor: inputBackground, borderColor: inputBorder },
              ]}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Altura</ThemedText>
            <TextInput
              value={formData.altura}
              onChangeText={(text) =>
                setFormData({ ...formData, altura: text })
              }
              placeholder="Ex.: 1,75 m"
              placeholderTextColor="#9ca3af"
              style={[
                styles.input,
                { backgroundColor: inputBackground, borderColor: inputBorder },
              ]}
            />
          </View>

          <View style={styles.documentActions}>
            <Pressable
              style={styles.documentButton}
              onPress={pickDocumentPhoto}
            >
              <ThemedText style={styles.documentButtonText}>
                Selecionar foto
              </ThemedText>
            </Pressable>
            <Pressable
              style={styles.documentButton}
              onPress={takeDocumentPhoto}
            >
              <ThemedText style={styles.documentButtonText}>
                Tirar foto
              </ThemedText>
            </Pressable>
          </View>

          {isAnalyzing ? (
            <View style={styles.helperBox}>
              <ActivityIndicator color="#0a7ea4" />
              <ThemedText style={styles.helperText}>
                Lendo documento com IA...
              </ThemedText>
            </View>
          ) : null}

          {extractionHint ? (
            <View style={styles.helperBox}>
              <ThemedText style={styles.helperText}>
                {extractionHint}
              </ThemedText>
            </View>
          ) : null}

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
  modeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 18,
  },
  modeButton: {
    flex: 1,
    minWidth: 140,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#f8fafc",
    alignItems: "center",
  },
  modeButtonActive: {
    backgroundColor: "#0a7ea4",
    borderColor: "#0a7ea4",
  },
  modeButtonText: {
    color: "#0f172a",
    fontWeight: "600",
  },
  modeButtonTextActive: {
    color: "#ffffff",
    fontWeight: "700",
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
  helperBox: {
    borderRadius: 14,
    padding: 12,
    backgroundColor: "#e0f2fe",
    marginBottom: 14,
  },
  helperText: {
    color: "#0f766e",
    fontSize: 13,
    marginTop: 6,
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
