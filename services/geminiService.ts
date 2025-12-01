import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateJobDescription = async (title: string, company: string, skills: string): Promise<string> => {
  try {
    const prompt = `Write a professional and attractive job description for a "${title}" position at "${company}". 
    Key required skills: ${skills}. 
    Keep it concise (under 150 words) and use bullet points for responsibilities.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Error generating job description:", error);
    return "Error generating content. Please check your API key.";
  }
};