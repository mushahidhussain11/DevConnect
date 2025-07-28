import express from "express";
import {
  getMessagesByConversation,
  sendAIMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/:conversationId", protectRoute, getMessagesByConversation);
router.post("/aiMessage", protectRoute, sendAIMessage);

export default router;
