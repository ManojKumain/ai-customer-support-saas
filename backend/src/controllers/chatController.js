// src/controllers/chatController.js

import generateReply from "../services/aiService.js";

const chatHandler = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate input
    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required and must be a string",
      });
    }

    console.time("Gemini Response Time");

    const reply = await generateReply(message);

    console.timeEnd("Gemini Response Time");

    res.status(200).json({ reply });

  } catch (error) {
    console.error("Chat Controller Error:", error);

    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export default chatHandler;

