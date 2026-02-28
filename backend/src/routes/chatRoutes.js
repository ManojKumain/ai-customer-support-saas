import express from "express";
import protect from "../middleware/authMiddleware.js";
import { chatHandler, deleteConversation } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", protect, chatHandler);
router.delete("/conversations/:id", protect, deleteConversation);

export default router;