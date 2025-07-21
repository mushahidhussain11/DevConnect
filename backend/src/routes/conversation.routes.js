import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {getUserConversations,deleteConversation,createConversation  } from "../controllers/conversation.controller.js";
const router = express.Router();


router.get("/:userId",protectRoute, getUserConversations);
router.post("/",protectRoute, createConversation);
router.delete("/:conversationId",protectRoute, deleteConversation);



export default router;