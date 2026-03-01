import express from "express";
import protect from "../middleware/authMiddleware.js";
import { chatHandler, deleteConversation, getUserConversations, renameConversation } from "../controllers/chatController.js";
import { chatLimiter

 } from "../middleware/rateLimiter.js";
const router = express.Router();

router.post("/", protect, chatHandler);
router.post("/chat/:id/message", protect, quota, chatHandler);
router.post("/", protect, chatLimiter, chatHandler);
router.get("/", protect, getUserConversations);
router.delete("/:id", protect, deleteConversation);
router.put("/:id", protect, renameConversation);

export default router;