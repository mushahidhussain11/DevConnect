import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getNotifications, deleteNotification } from "../controllers/notification.controller.js";
const router = express.Router();


router.get("/:id",protectRoute,getNotifications)
router.delete("/:id",protectRoute,deleteNotification)



export default router;