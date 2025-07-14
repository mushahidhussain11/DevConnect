import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllProjects, getProjectsById, createProject, updateProject, deleteProject, reactToProject } from "../controllers/projects.controller.js";
import { setTimeoutMiddleware } from "../middleware/timeout.js";
import { upload } from "../middleware/multer.js";
const router = express.Router();


router.get("/",protectRoute,getAllProjects)
router.get("/:id",protectRoute,getProjectsById)
router.post("/",setTimeoutMiddleware(90000),protectRoute,upload.array("images"),createProject)
router.put("/:id",setTimeoutMiddleware(90000),protectRoute,upload.array("images"),updateProject)
router.delete("/:id",protectRoute,deleteProject);

router.put("/:id/react",protectRoute,reactToProject)


export default router;