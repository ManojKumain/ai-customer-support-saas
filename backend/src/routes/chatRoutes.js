import express from "express";
import protect from "../middleware/authMiddleware.js";
import { chatHandler, deleteConversation, renameConversation } from "../controllers/chatController.js";

const router = express.Router();

router.post("/", protect, chatHandler);
router.delete("/:id", protect, deleteConversation);
router.put("/:id", protect, renameConversation);

export default router;