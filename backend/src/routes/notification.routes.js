import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
// import { sendNotification } from "../controllers/notification.controller.js";
const router = express.Router();


// router.post("/send",protectRoute,sendNotification)



export default router;