import Post from "../models/post.model.js";
import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
import { sendNotification } from "../utils/notificationSender.js";
export async function addComment(req, res) {
  const userId = req.user?._id;
  const { postId } = req.params;
  const { text } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(postId))
      return res.status(400).json({ message: "Invalid post id" });

    const post = await Post.findById(postId);
    if (!post) return res.status(400).json({ message: "Post not found" });

    const comment = await Comment.create({ userId, postId, text: text });

    if (!post?.userId.equals(userId)) {
      sendNotification(userId, post?.userId, "comment");
    }

    res.status(200).json({ message: "Comment added successfully", comment });
  } catch (error) {
    console.log("Error in add comment controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function getComments(req, res) {
  const { postId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(postId))
      return res.status(400).json({ message: "Invalid post id" });

    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });

    res
      .status(200)
      .json({ message: "Comments fetched successfully", comments });
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
      return res.status(400).json({ message: "Invalid post id" });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(400).json({ message: "Comment not found" });

    const postId = comment?.postId;

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
  } catch (error) {
    console.log("Error in delete comment controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
