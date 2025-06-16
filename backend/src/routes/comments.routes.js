import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { addComment,getComments,deleteComment } from "../controllers/comments.controller.js";

const router  = express.Router();


router.post("/:id/comments", protectRoute, addComment);           // Add comment
router.get("/:id/comments", protectRoute, getComments);           // Get comments
router.delete("/:postId/comments/:commentId", protectRoute, deleteComment); // Delete comment

export default router;