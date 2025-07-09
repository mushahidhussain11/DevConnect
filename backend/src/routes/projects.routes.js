import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllProjects, getProjectsById, createProject, updateProject, deleteProject, reactToProject } from "../controllers/projects.controller.js";
import { setTimeoutMiddleware } from "../middleware/timeout.js";
const router = express.Router();


router.get("/",protectRoute,getAllProjects)
router.get("/:id",protectRoute,getProjectsById)
router.post("/",setTimeoutMiddleware(60000),protectRoute,createProject)
router.put("/:id",setTimeoutMiddleware(60000),protectRoute,updateProject)
router.delete("/:id",protectRoute,deleteProject);

router.put("/:id/react",protectRoute,reactToProject)


export default router;