import express from "express"
import { signup, login, forgotPassword, socialAuth, logout, resetPassword,getMe } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();


router.get("/me",protectRoute,getMe)
router.post("/signup",signup)
router.post("/login",login)
router.post("/forgot-password",forgotPassword)
router.post("/reset-password/:token",resetPassword)
router.post("/social",socialAuth)
router.post("/logout",logout)


export default router;

