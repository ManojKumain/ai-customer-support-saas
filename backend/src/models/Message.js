import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    usage: {
      promptTokens: { type: Number, default: 0 },
      outputTokens: { type: Number, default: 0 },
      totalTokens: { type: Number, default: 0 },
      thoughtsTokens: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Index for fast conversation message retrieval
messageSchema.index({ conversation: 1, createdAt: 1 });

export default mongoose.model("Message", messageSchema);