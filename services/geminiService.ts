import { GoogleGenAI, Type } from "@google/genai";
import { GeminiWordResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchWordDefinition = async (word: string): Promise<GeminiWordResponse> => {
  const modelId = "gemini-3-flash-preview";
  
  const prompt = `Define the English word "${word}". Provide the phonetic transcription, a concise definition in Chinese, one clear example sentence in English, and the part of speech.`;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          definition: { type: Type.STRING, description: "A concise definition of the word in Chinese." },
          example: { type: Type.STRING, description: "A short example sentence using the word in English." },
          phonetic: { type: Type.STRING, description: "The IPA phonetic transcription." },
          partOfSpeech: { type: Type.STRING, description: "Noun, Verb, Adjective, etc." }
        },
        required: ["definition", "example", "phonetic", "partOfSpeech"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(text) as GeminiWordResponse;
};