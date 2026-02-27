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

    return response.text;
  } catch (error) {
    console.error("Gemini Service Error:", error);
    throw new Error("Failed to generate AI response");
  }
};

export default generateReply;



