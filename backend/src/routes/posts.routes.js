import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { createPost, getAllPosts, getPostsById, updatePost, deletePost, reactToPost } from "../controllers/posts.controller.js";
import { upload } from "../middleware/multer.js";

const router  = express.Router();

                        
router.get("/", protectRoute,getAllPosts);                        
router.get("/:id", protectRoute, getPostsById);
router.post("/",protectRoute,upload.single("image"), createPost);                    
router.put("/:id", protectRoute,upload.single("image"), updatePost);                      
router.delete("/:id", protectRoute, deletePost);   

router.put("/:id/react", protectRoute, reactToPost);               

export default router;