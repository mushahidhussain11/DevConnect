import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
export async function getUserConversations(req,res) {
  const { userId } = req.params;

  try {

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ message: "Invalid  id" });

    const conversations = await Conversation.find({ members: userId }).populate("members", "fullName onlineStatus lastSeen profilePic _id").sort({
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
  const userId = req.user?._id;

  try {
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ message: "Invalid conversation ID" });
    }

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // User must be part of the conversation
    if (!conversation.members.includes(userId)) {
      return res.status(403).json({ message: "Not authorized to delete this conversation" });
    }

    // Already deleted by this user
    if (conversation.deletedBy?.equals(userId)) {
      return res.status(200).json({ message: "Conversation already deleted for you" });
    }

    // If already deleted by other user, then permanently delete
    if (conversation.deletedBy && !conversation.deletedBy.equals(userId)) {
      await Conversation.findByIdAndDelete(conversationId);
      await Message.deleteMany({ conversationId });
      return res.status(200).json({ message: "Conversation permanently deleted" });
    }

    // First-time delete: mark soft delete
    conversation.deletedBy = userId;
    await conversation.save();

    return res.status(200).json({
      message: "Conversation deleted for current user",
      conversation,
    });

  } catch (error) {
    console.error("Delete conversation error:", error);
    return res.status(500).json({ message: "Server error while deleting conversation" });
  }
}


export async function createConversation(req, res) {
  try {
    const { senderId, receiverId } = req.body;

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: "Invalid sender or receiver ID" });
    }

    // Check for existing conversation
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId], $size: 2 },
    });

    if (conversation) {
      // If soft-deleted by sender, restore it
      if (conversation.deletedBy?.toString() === senderId) {
        conversation.deletedBy = null;
        await conversation.save();

        return res.status(200).json({
          message: "Conversation restored",
          conversation,
        });
      }

      return res.status(200).json({
        message: "Conversation already exists",
        conversation,
      });
    }

    // Create new conversation
    const newConversation = await Conversation.create({
      members: [senderId, receiverId],
    });

    const createdConversation = await Conversation.findById(newConversation._id).populate("members", "fullName onlineStatus lastSeen profilePic _id");

    return res.status(201).json({
      message: "Conversation created successfully",
      conversation: createdConversation,
    });

  } catch (error) {
    console.error("Error in createConversation controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
