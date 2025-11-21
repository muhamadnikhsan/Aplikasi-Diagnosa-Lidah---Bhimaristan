import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    visualFindings: {
      type: Type.OBJECT,
      properties: {
        color: { type: Type.STRING, description: "Warna tubuh lidah (mis: Pucat, Merah, Ungu)" },
        shape: { type: Type.STRING, description: "Bentuk lidah (mis: Bengkak, Tipis, Tanda Gigi)" },
        coating: { type: Type.STRING, description: "Selaput lidah (mis: Tebal, Tipis, Mengupas, Tanpa Selaput)" },
        moisture: { type: Type.STRING, description: "Kelembapan (mis: Kering, Basah, Licin)" },
        fissures: { type: Type.STRING, description: "Retakan (mis: Retak tengah, Retak horizontal)" },
        features: { type: Type.STRING, description: "Fitur lain (mis: Bintik merah/petechiae, vena sublingual)" },
      },
      required: ["color", "shape", "coating", "moisture", "fissures", "features"],
    },
    tcmPattern: {
      type: Type.OBJECT,
      properties: {
        vitalSubstances: { type: Type.STRING, description: "Gangguan Qi, Xue, Yin, Yang" },
        zangFu: { type: Type.STRING, description: "Organ Zang Fu yang terlibat (mis: Limpa, Hati, Ginjal)" },
        condition: { type: Type.STRING, description: "Kondisi (Kelebihan/Xu atau Kekurangan/Shi)" },
        pathogen: { type: Type.STRING, description: "Patogen (Panas, Dingin, Lembab, Angin)" },
      },
      required: ["vitalSubstances", "zangFu", "condition", "pathogen"],
    },
    diagnosisReasoning: {
      type: Type.STRING,
      description: "Penjelasan rinci mengapa pola ini dipilih berdasarkan temuan visual.",
    },
    treatment: {
      type: Type.OBJECT,
      properties: {
        acupuncturePoints: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Daftar titik akupunktur utama dan tambahan.",
        },
        technique: {
          type: Type.STRING,
          description: "Teknik terapi (Tonifikasi, Sedasi, Moksibusi, dll).",
        },
        herbalRecommendations: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Saran herbal sederhana yang aman.",
        },
      },
      required: ["acupuncturePoints", "technique", "herbalRecommendations"],
    },
    icd10: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          code: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["code", "description"],
      },
      description: "Kemungkinan kode ICD-10 yang relevan dengan gejala klinis yang biasanya menyertai pola lidah ini.",
    },
  },
  required: ["visualFindings", "tcmPattern", "diagnosisReasoning", "treatment", "icd10"],
};

export const analyzeTongueImage = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  try {
    const model = 'gemini-2.5-flash'; // Using flash for fast multimodal analysis
    
    const prompt = `
      Anda adalah ahli TCM (Traditional Chinese Medicine) tingkat senior.
      Tugas Anda adalah menganalisis gambar lidah yang diberikan.
      
      Lakukan langkah berikut:
      1. Analisis visual: Warna, Bentuk, Tepi, Fissure, Coating, Kelembapan, Petechiae, dll.
      2. Tentukan Pola TCM: Qi/Xue/Yin/Yang, Zang Fu, Shi/Xu, Panas/Dingin.
      3. Jelaskan alasannya.
      4. Berikan Tatalaksana: Titik akupunktur, Teknik, dan Herbal sederhana.
      5. Tautkan ke kemungkinan diagnosis medis Barat dan ICD-10.
      
      Gunakan Bahasa Indonesia yang profesional dan jelas.
      Jika gambar tersebut BUKAN lidah manusia atau tidak jelas, kembalikan data kosong dengan diagnosisReasoning berisi pesan error yang sopan.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    if (!response.text) {
      throw new Error("No response from Gemini.");
    }

    const data = JSON.parse(response.text) as AnalysisResult;
    return data;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};
