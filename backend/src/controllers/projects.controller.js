import Project from "../models/project.model.js";
import User from "../models/user.model.js";
import cloudinary from "../utils/cloundinary.config.js";
import mongoose from "mongoose";

export async function getAllProjects(req, res) {
  try {
    const projects = await Project.find({}).sort({ createdAt: -1 });

    res
      .status(200)
      .json({ message: "Projects fetched successfully", projects });
  } catch (error) {
    console.log("Error in get all projects controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getProjectsById(req, res) {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid  id" });

    const projects = await Project.find({ userId: id }).sort({ createdAt: -1 });

    res
      .status(200)
      .json({ message: "Projects fetched successfully", projects });
  } catch (error) {
    console.log("Error in get projects by id controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function createProject(req, res) {
  const userId = req.user._id;
  const {
    title,
    description,
    techStack,
    repoLink,
    liveDemoLink,
    thumbnails,
    tags,
  } = req.body;

  try {
    if (!title || !description)
      return res
        .status(400)
        .json({ message: "Title and description fields are required" });

    if (thumbnails) {
      for (let i = 0; i < thumbnails.length; i++) {
        const uploadedResponse = await cloudinary.uploader.upload(
          thumbnails[i]
        );
        thumbnails[i] = uploadedResponse.secure_url;
      }
    }

    const newProject = await new Project({
      userId,
      title,
      description,
      techStack: techStack ? techStack : [],
      repoLink: repoLink ? repoLink : "",
      liveDemoLink: liveDemoLink ? liveDemoLink : "",
      thumbnails: thumbnails ? thumbnails : [],
      tags: tags ? tags : [],
    });

    await newProject.save();

    const user = await User.findById(userId);
    user.numberOfProjects = user.numberOfProjects + 1;
    await user.save();

    res
      .status(200)
      .json({ message: "Project created successfully", newProject });
  } catch (error) {
    console.log("Error in create project controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function updateProject(req, res) {
  const projectId = req.params.id;
  const {
    title,
    description,
    techStack,
    repoLink,
    liveDemoLink,
    thumbnails,
    tags,
  } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(projectId))
      return res.status(400).json({ message: "Invalid project id" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(400).json({ message: "Project not found" });

    if (!project?.userId.equals(req.user?._id))
      return res
        .status(400)
        .json({ message: "You are not authorized to update this project" });

    if (thumbnails) {
      for (let i = 0; i < thumbnails?.length; i++) {
        if (project?.thumbnails?.includes(thumbnails[i])) {
          // await cloudinary.uploader.destroy(project.thumbnails[i].split("/").pop().split(".")[0])
        } else {
          const uploadedResponse = await cloudinary.uploader.upload(
            thumbnails[i]
          );
          thumbnails[i] = uploadedResponse.secure_url;
        }
      }
    }

    for (let i = 0; i < project?.thumbnails?.length; i++) {
      if (!thumbnails?.includes(project?.thumbnails[i])) {
        await cloudinary.uploader.destroy(
          project?.thumbnails[i].split("/").pop().split(".")[0]
        );
      }
    }

    if (title) project.title = title;
    if (description) project.description = description;
    if (techStack) project.techStack = techStack;
    if (repoLink) project.repoLink = repoLink;
    if (liveDemoLink) project.liveDemoLink = liveDemoLink;
    if (thumbnails) project.thumbnails = thumbnails;
    if (tags) project.tags = tags;

    await project.save();

    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    console.log("Error in update project controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function deleteProject(req, res) {
  const projectId = req.params.id;
  const userId = req.user._id;
  try {
    if (!mongoose.Types.ObjectId.isValid(projectId))
      return res.status(400).json({ message: "Invalid project id" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(400).json({ message: "Project not found" });

    if (!project?.userId.equals(userId))
      return res
        .status(400)
        .json({ message: "You are not authorized to delete this project" });

    for (let i = 0; i < project?.thumbnails?.length; i++) {
      await cloudinary.uploader.destroy(
        project?.thumbnails[i].split("/").pop().split(".")[0]
      );
    }

    const deletedProject = await Project.findByIdAndDelete(projectId);

    const user = await User.findById(userId);
    user.numberOfProjects = user.numberOfProjects - 1;
    await user.save();

    res
      .status(200)
      .json({ message: "Project deleted successfully", deletedProject });
  } catch (error) {}
}
export async function reactToProject(req, res) {

  const projectId = req.params.id;
  const userId = req.user._id;
  const { typeOfReaction } = req.body;
  let isReacted = false;
  let typeOfReactionAlreadyGiven = "";

  try {
    if (!mongoose.Types.ObjectId.isValid(projectId))
      return res.status(400).json({ message: "Invalid project id" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(400).json({ message: "Project not found" });

    for (let key in project?.reactions) {
      project.reactions[key] = Array.isArray(project.reactions[key])
        ? project.reactions[key]
        : [];
      if (project.reactions[key].includes(userId)) {
        isReacted = true;
        typeOfReactionAlreadyGiven = key;
      }
    }

    if (isReacted) {
      project.reactions[typeOfReactionAlreadyGiven].pull(userId);
      if (typeOfReactionAlreadyGiven !== typeOfReaction) {
        project.reactions[typeOfReaction].push(userId);
      }
    } else {
      project?.reactions[typeOfReaction].push(userId);

      if (!project?.userId.equals(userId)) {
        await sendNotification(userId, project.userId, typeOfReaction);
      }
    }

    await project.save();

    res.status(200).json({ message: "Project reacted successfully", project });
  } catch (error) {
    console.log("Error in react to Project controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
