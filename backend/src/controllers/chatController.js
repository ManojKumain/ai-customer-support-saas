import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import generateReply from "../services/aiService.js";
import { generateTitleFromText } from "../utils/generateTitle.js";

const chatHandler = async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    let conversation;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required and must be a string",
      });
    }

    if (!conversationId) {
      conversation = await Conversation.create({
        user: req.user._id,
      });
    } else {
      conversation = await Conversation.findOne({
        _id: conversationId,
        user: req.user._id,
        isDeleted: false,
      });

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" })
      }
    }

    // 1️⃣ Save user message
    await Message.create({
      conversation: conversation._id,
      role: "user",
      content: message,
    });

    // 2️⃣ Fetch last 10 messages
    const messages = await Message.find({
      conversation: conversation._id,
    })
      .sort({ createdAt: 1 })
      .limit(10);

    const orderedMessages = messages.reverse();

    const history = orderedMessages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    console.time("Gemini Response Time");

    let aiResult;
    try {
      aiResult = await generateReply(history);
    } finally {
      console.timeEnd("Gemini Response Time");
    }

    const { text: reply, usage } = aiResult;

    console.log("Token Usage:", usage); // temporary inspection
    console.log("USAGE OBJECT IN CONTROLLER:", usage);

    // 3️⃣ Save assistant reply
    await Message.create({
      conversation: conversation._id,
      role: "assistant",
      content: reply,
      usage: {
        promptTokens: usage.promptTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
        thoughtsTokens: usage.thoughtsTokens,
      },
    });

    // 4️⃣ Auto-generate conversation title (only first time)
    if (conversation.title === "New Chat") {
      const newTitle = generateTitleFromText(message);
      conversation.title = newTitle;
      await conversation.save();
    }

    await Conversation.findByIdAndUpdate(
      conversation._id,
      {
        $inc: {
          "tokenUsage.totalTokens": usage.totalTokens,
          "tokenUsage.promptTokens": usage.promptTokens,
          "tokenUsage.outputTokens": usage.outputTokens,
        },
      }
    );


    res.status(200).json({ reply, conversationId: conversation._id, });

  } catch (error) {
    console.error("Chat Controller Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params;

    const conversation = await Conversation.findOneAndUpdate(
      {
        _id: id,
        user: req.user._id,
        isDeleted: false,
      },
      { isDeleted: true },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.status(200).json({ message: "Conversation deleted successfully" });

  } catch (error) {
    console.error("Delete Conversation Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const renameConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ error: "Valid title is required" });
    }



    const updatedConversation = await Conversation.findOneAndUpdate(
      {
        _id: id,
        user: req.user._id,
        isDeleted: false,
      },
      {
        title: title.trim(),
      },
      { new: true }
    );



    if (!updatedConversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.status(200).json({
      message: "Conversation renamed successfully",
      conversation: updatedConversation,
    });

  } catch (error) {
    console.error("Rename Conversation Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { chatHandler, deleteConversation, renameConversation };