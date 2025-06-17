import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllProjects, getProjectsById, createProject, updateProject, deleteProject, reactToProject } from "../controllers/projects.controller.js";

const router = express.Router();


router.get("/",protectRoute,getAllProjects)
router.get("/:id",protectRoute,getProjectsById)
router.post("/",protectRoute,createProject)
router.put("/:id",protectRoute,updateProject)
router.delete("/:id",protectRoute,deleteProject);

router.put("/:id/react",protectRoute,reactToProject)


export default router;