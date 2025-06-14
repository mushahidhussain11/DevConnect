import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getSuggestedUsers, getUserById, getSearchUsers, followUser, unfollowUser } from "../controllers/user.controller.js";

const router = express.Router();


router.get("/suggestions",protectRoute,getSuggestedUsers)
router.get("/search",protectRoute,getSearchUsers)
router.get("/:id",protectRoute,getUserById)
router.put("/follow/:id",protectRoute,followUser)
router.put("/unfollow:id",protectRoute,unfollowUser)




export default router;

