import Project from "../models/project.model.js";
import User from "../models/user.model.js";
import cloudinary from "../utils/cloundinary.config.js";
import mongoose from "mongoose";
import {sendNotification} from "../utils/notificationSender.js";
import fs from "fs";

export async function getAllProjects(req, res) {
  try {
    const projects = await Project.find({}).populate("userId", "username fullName role profilePic _id").sort({ createdAt: -1 });

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

    const projects = await Project.find({ userId: id }).sort({ createdAt: -1 }).populate("userId", "username fullName role profilePic _id");

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
    tags,
  } = req.body;

  console.log("it hits")

  console.log(req?.files)
  console.log(req?.body)

  const thumbnails = req?.files.map((file) => file?.path);



  try {
    if (!title || !description)
      return res
        .status(400)
        .json({ message: "Title and description fields are required" });

    if (thumbnails) {
  const uploadPromises = thumbnails.map((thumb, i) =>
    cloudinary.uploader.upload(thumb).then((uploadedResponse) => {
      // delete local file after upload
      fs.unlink(thumb, (err) => {
        if (err) {
          console.error("Failed to delete local image:", err);
        } else {
          console.log("Local image deleted successfully");
        }
      });
      return uploadedResponse.secure_url;
    })
  );

  // Wait for all uploads to finish in parallel
  const uploadedUrls = await Promise.all(uploadPromises);
  thumbnails.splice(0, thumbnails.length, ...uploadedUrls); // Replace old paths with URLs
}



    let newProject = await new Project({
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

     newProject = await Project.findById(newProject?._id).populate(
      "userId",
      "username fullName role profilePic _id"
    );

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

  console.log(req.body)
  const {
    title,
    description,
    techStack,
    repoLink,
    liveDemoLink,
    removedImages,
    tags,
  } = req.body;



  const thumbnails = req?.files.map((file) => file?.path);

  try {
    if (!mongoose.Types.ObjectId.isValid(projectId))
      return res.status(400).json({ message: "Invalid project id" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(400).json({ message: "Project not found" });

    if (!project?.userId.equals(req.user?._id))
      return res
        .status(400)
        .json({ message: "You are not authorized to update this project" });


    if(removedImages?.length > 0){
      for (let i = 0; i < removedImages?.length; i++) {
        await cloudinary.uploader.destroy(removedImages[i]);

        const image = removedImages[i];

        for(let i = 0; i < project?.thumbnails?.length; i++){

            const cleanedUrl = project?.thumbnails[i].split("?")[0].split(".").slice(0, -1).join(".");
            const parts = cleanedUrl.split("/");
            const updatedImage = parts[parts.length - 1];


          if(updatedImage === image){
            project.thumbnails.splice(i, 1);
            await project.save();
          }
        }

       
        // project.thumbnails.pull(removedImages[i]);
      }
    }

   
    if(thumbnails?.length > 0){
      const uploadPromises = thumbnails.map((thumb, i) =>
        cloudinary.uploader.upload(thumb).then((uploadedResponse) => {
          // delete local file after upload
          fs.unlink(thumb, (err) => {
            if (err) {
              console.error("Failed to delete local image:", err);
            } else {
              console.log("Local image deleted successfully");
            }
          });
          return uploadedResponse.secure_url;
        })
      );
    
      // Wait for all uploads to finish in parallel
      const uploadedUrls = await Promise.all(uploadPromises);
      thumbnails.splice(0, thumbnails.length, ...uploadedUrls); // Replace old paths with URLs
    }



    if (title) project.title = title;
    if (description) project.description = description;
    if (techStack) project.techStack = techStack;
    if (repoLink) project.repoLink = repoLink;
    if (liveDemoLink) project.liveDemoLink = liveDemoLink;
    if (thumbnails) project.thumbnails = [...project?.thumbnails, ...thumbnails];
    if (tags) project.tags = tags;

    await project.save();

    const updatedProject = await Project.findById(projectId).populate("userId","fullName role profilePic _id");

    res.status(200).json({ message: "Project updated successfully", updatedProject });
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
        await sendNotification(userId, project.userId, typeOfReaction,null, projectId);
      }
    }

    await project.save();

    res.status(200).json({ message: "Project reacted successfully", project });
  } catch (error) {
    console.log("Error in react to Project controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
