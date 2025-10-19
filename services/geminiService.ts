
import { GoogleGenAI } from "@google/genai";

export const generateMessageWithAI = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a short, engaging marketing message based on the following prompt. The message should be suitable for WhatsApp. Do not include any greetings like "Hello" or signatures. Just provide the message body. Prompt: "${prompt}"`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating message with AI:", error);
    return "Failed to generate message. Please try again.";
  }
};
