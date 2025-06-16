import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getSuggestedUsers, getUserById, getSearchUsers, followUser, unfollowUser,updateUser } from "../controllers/user.controller.js";

const router = express.Router();


router.get("/suggestions",protectRoute,getSuggestedUsers)
router.get("/search",protectRoute,getSearchUsers)
router.put("/follow/:id",protectRoute,followUser)
router.put("/unfollow/:id",protectRoute,unfollowUser)
router.put("/:id",protectRoute,updateUser)
router.get("/:id",protectRoute,getUserById)




export default router;

