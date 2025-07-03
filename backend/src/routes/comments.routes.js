import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { addComment,getComments,deleteComment } from "../controllers/comments.controller.js";

const router  = express.Router();


router.post("/:id", protectRoute, addComment);           // Add comment
router.get("/:id",protectRoute,  getComments);           // Get comments
router.delete("/:commentId", protectRoute, deleteComment); // Delete comment

export default router;