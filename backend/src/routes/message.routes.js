import express from "express";
import {
  getMessagesByConversation,
  sendMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/:conversationId", protectRoute, getMessagesByConversation);

export default router;
