import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getSuggestedUsers, getUserById, getSearchUsers, followUser, unfollowUser,updateUser,getAllOtherUsers } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.js";
const router = express.Router();
import { setTimeoutMiddleware } from "../middleware/timeout.js";



router.get("/allUsers/:id",protectRoute,getAllOtherUsers)
router.get("/suggestions",protectRoute,getSuggestedUsers)
router.get("/search",protectRoute,getSearchUsers)
router.put("/follow/:id",protectRoute,followUser)
router.put("/unfollow/:id",protectRoute,unfollowUser)
router.put("/:id",setTimeoutMiddleware(40000),protectRoute,upload.single("profilePic"),updateUser)
router.get("/:id",protectRoute,getUserById)



export default router;

