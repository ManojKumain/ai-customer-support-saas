import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateReply = async (history) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: history,
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const usageMetadata = response.usageMetadata || {};

    const usage = {
      promptTokens: usageMetadata.promptTokenCount || 0,
      outputTokens: usageMetadata.candidatesTokenCount || 0,
      totalTokens: usageMetadata.totalTokenCount || 0,
      thoughtsTokens: usageMetadata.thoughtsTokenCount || 0,
    };

    return { text, usage };

  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw new Error("Failed to generate AI response");
  }
};

export default generateReply;



