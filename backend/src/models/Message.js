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
  },
  { timestamps: true }
);

// Index for fast conversation message retrieval
messageSchema.index({ conversation: 1, createdAt: 1 });

export default mongoose.model("Message", messageSchema);