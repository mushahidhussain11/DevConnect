import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { createPost, getAllPosts, getPostsById, updatePost, deletePost, reactToPost } from "../controllers/posts.controller.js";

const router  = express.Router();


router.post("/", protectRoute, createPost);                        
router.get("/", protectRoute, getAllPosts);                        
router.get("/:id", protectRoute, getPostsById);                    
router.put("/:id", protectRoute, updatePost);                      
router.delete("/:id", protectRoute, deletePost);   

router.put("/:id/react", protectRoute, reactToPost);               


export default router;