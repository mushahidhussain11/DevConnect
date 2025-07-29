import express from "express";
import {
  getMessagesByConversation,
  sendAIMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();
import { setTimeoutMiddleware } from "../middleware/timeout.js";

router.get("/:conversationId", protectRoute, getMessagesByConversation);
router.post("/aiMessage",setTimeoutMiddleware(60000), protectRoute, sendAIMessage);

export default router;
