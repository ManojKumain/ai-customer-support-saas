import Message from "../models/Message.js";
import generateReply from "../services/aiService.js";

const chatHandler = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required and must be a string",
      });
    }

    // 1️⃣ Save user message
    await Message.create({
      user: req.user._id,
      role: "user",
      content: message,
    });

    // 2️⃣ Fetch last 10 messages
    const messages = await Message.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    const conversation = messages.reverse();

    const history = conversation.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    console.time("Gemini Response Time");

    const reply = await generateReply(history);

    console.timeEnd("Gemini Response Time");

    // 3️⃣ Save assistant reply
    await Message.create({
      user: req.user._id,
      role: "assistant",
      content: reply,
    });

    res.status(200).json({ reply });

  } catch (error) {
    console.error("Chat Controller Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default chatHandler;