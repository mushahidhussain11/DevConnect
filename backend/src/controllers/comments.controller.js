import Post from "../models/post.model.js";
import Project from "../models/project.model.js";
import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
import { sendNotification } from "../utils/notificationSender.js";
export async function addComment(req, res) {

  console.log("aadd comment api is hitting")
  const userId = req.user?._id;
  const { id } = req.params;
  const { text } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid id" });

    const post = await Post.findById(id);
    const project = await Project.findById(id);

    if (!post && !project)
      return res.status(400).json({ message: "Post or Project not found" });

    if (post) {
      const comment = await Comment.create({ userId, postId: id, text: text });
      post.numberOfComments = post?.numberOfComments + 1;
      await post.save();

      if (!post?.userId.equals(userId)) {
        sendNotification(userId, post?.userId, "comment");
      }

      res.status(200).json({ message: "Comment added successfully", comment });
    } else {
      const comment = await Comment.create({
        userId,
        projectId: id,
        text: text,
      });
      project.numberOfComments = project?.numberOfComments + 1;
      await project.save();

      if (!project?.userId.equals(userId)) {
        sendNotification(userId, project?.userId, "comment");
      }

      res.status(200).json({ message: "Comment added successfully", comment });
    }
  } catch (error) {
    console.log("Error in add comment controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getComments(req, res) {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid id" });

    const postComments = await Comment.find({ postId: id }).populate("userId" ,"fullName profilePic _id").sort({
      createdAt: -1,
    });
    const projectComments = await Comment.find({ projectId: id }).populate("userId" ,"fullName profilePic _id").sort({
      createdAt: -1,
    });
   

    if (!postComments && !projectComments)
      return res.status(400).json({ message: "Comments not found" });

    if (postComments?.length > 0 && !projectComments?.length > 0) {
      res
        .status(200)
        .json({ message: "Comments fetched successfully", postComments });
    } else if (!postComments?.length > 0 && projectComments?.length > 0) {
      res
        .status(200)
        .json({ message: "Comments fetched successfully", projectComments });
    } else if(!postComments?.length > 0 && !projectComments?.length > 0) {
      res
        .status(200)
        .json({ message: "Comments fetched successfully", postComments, projectComments });
    } else if(postComments?.length > 0 && projectComments?.length > 0) {
      res
        .status(200)
        .json({ message: "Comments fetched successfully", postComments, projectComments });
    }
  } catch (error) {
    console.log("Error in get comments controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function deleteComment(req, res) {
  const { commentId } = req.params;
  const userId = req.user?._id;

  try {
    if (!mongoose.Types.ObjectId.isValid(commentId))
      return res.status(400).json({ message: "Invalid  id" });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(400).json({ message: "Comment not found" });

    const postId = comment?.postId;
    const projectId = comment?.projectId;

    if (postId) {
      const post = await Post.findById(postId);
      if (!post) return res.status(400).json({ message: "Post not found" });

      if (post?.userId.equals(userId)) {
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        res
          .status(200)
          .json({ message: "Comment deleted successfully", deletedComment });
      } else {
        if (comment?.userId.equals(userId)) {
          const deletedComment = await Comment.findByIdAndDelete(commentId);
          res
            .status(200)
            .json({ message: "Comment deleted successfully", deletedComment });
        }

        if (!comment?.userId.equals(userId))
          return res
            .status(400)
            .json({ message: "You are not authorized to delete this comment" });
      }

      post.numberOfComments = post.numberOfComments - 1;
      await post.save();
    } else if (projectId) {
      const project = await Project.findById(projectId);
      if (!project)
        return res.status(400).json({ message: "Project not found" });

      if (project?.userId.equals(userId)) {
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        res
          .status(200)
          .json({ message: "Comment deleted successfully", deletedComment });
      } else {
        if (comment?.userId.equals(userId)) {
          const deletedComment = await Comment.findByIdAndDelete(commentId);
          res
            .status(200)
            .json({ message: "Comment deleted successfully", deletedComment });
        }

        if (!comment?.userId.equals(userId))
          return res
            .status(400)
            .json({ message: "You are not authorized to delete this comment" });
      }

      project.numberOfComments = project.numberOfComments - 1;
      await project.save();
    }
  } catch (error) {
    console.log("Error in delete comment controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function deletePostComments (postId) {
  try {
    await Comment.deleteMany({ postId: postId });
  } catch (error) {
    console.log("Error in delete post comments controller", error);
  }
}

export async function deleteProjectComments (projectId) {
  try {
    await Comment.deleteMany({ projectId: projectId });
  } catch (error) {
    console.log("Error in delete project comments controller", error);
  }
}