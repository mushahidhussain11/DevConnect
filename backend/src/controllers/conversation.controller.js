import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
export async function getUserConversations(req,res) {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ message: "Invalid  id" });

    const conversations = await Conversation.find({ members: userId }).sort({
      createdAt: -1,
    });

    res
      .status(200)
      .json({ message: "Conversations fetched successfully", conversations });
  } catch (error) {
    console.log("Error in get conversations by id controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export async function deleteConversation(req, res) {
  const { conversationId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Check if user is a participant
    if (!conversation?.members?.includes(req.user?._id)) {
      return res.status(403).json({ message: "Not authorized to delete this conversation" });
    }

    if(conversation?.deletedBy?.equals(req.user?._id)) {
      return res.status(200).json({ message: "Conversation already deleted" });
    }

    // Soft delete: track who deleted it
    if (conversation?.deletedBy) {
      // Already deleted by this user, proceed to full delete
      const deletedConversation = await Conversation.findByIdAndDelete(conversationId);
      const deletedMessages = await Message.deleteMany({ conversationId: conversationId });
      return res.status(200).json({
        message: "Conversation permanently deleted",
        deletedConversation,
      });
    } else {
      // First time delete by this user
      conversation.deletedBy = req.user?._id;
      await conversation.save();

      return res.status(200).json({
        message: "Conversation deleted for current user",
        conversation,
      });
    }

  } catch (error) {
    console.error("Delete conversation error:", error);
    return res.status(500).json({ message: "Server error while deleting conversation" });
  }
}