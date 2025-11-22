import { GoogleGenAI } from "@google/genai";
import { OrderItem } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const getOrderRecommendation = async (currentItems: OrderItem[]): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Error: API Key no configurada.";

  const itemNames = currentItems.map(i => i.name).join(", ");
  const prompt = `
    Actúa como un camarero experto y carismático en un bar llamado "Refugio".
    El cliente ha pedido: ${itemNames}.
    Si la lista está vacía, recomienda el especial de la casa (Hamburguesa Refugio y Cerveza IPA).
    Si hay items, sugiere 1 bebida o postre que combine perfectamente.
    Sé breve, amigable y responde en texto plano (máximo 2 frases).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No se pudo generar una recomendación.";
  } catch (error) {
    console.error("Error fetching recommendation:", error);
    return "El chef está ocupado en este momento.";
  }
};

export const generateReceiptMessage = async (items: OrderItem[], total: number): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Gracias por su visita.";

  const prompt = `
    Escribe un mensaje corto y divertido para el ticket de compra de un bar.
    Total gastado: $${total}. Items: ${items.length}.
    Estilo: Informal, "cool". Máximo 15 palabras.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "¡Gracias por venir al Refugio!";
  } catch (error) {
    return "¡Gracias por venir al Refugio!";
  }
};