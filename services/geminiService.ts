
import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client with the mandatory API_KEY from environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBookSummary = async (title: string, author: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `بصفتك مساعد مكتبي، قم بكتابة نبذة قصيرة وجذابة باللغة العربية عن كتاب بعنوان "${title}" لمؤلفه "${author}". اجعلها في حدود سطرين.`,
    });
    // Accessing the .text property of GenerateContentResponse
    return response.text || "لا يتوفر وصف حالياً.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "حدث خطأ أثناء محاولة توليد الوصف.";
  }
};
