import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "New Chat",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for fast sidebar loading
conversationSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Conversation", conversationSchema);