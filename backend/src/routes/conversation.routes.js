import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {getUserConversations,deleteConversation  } from "../controllers/conversation.controller.js";
const router = express.Router();


router.get("/:userId",protectRoute, getUserConversations);
router.delete("/:conversationId",protectRoute, deleteConversation);



export default router;