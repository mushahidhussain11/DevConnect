import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
export async function getUserConversations(req, res) {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ message: "Invalid  id" });

    // const conversations = await Conversation.find({
    //   members: userId,
    //   deletedBy: { $ne: userId },
    //   $or: [{ createdBy: { $in: [userId] } }, { numberOfMessages: { $gt: 0 } }],
    // })
    //   .populate("members", "fullName onlineStatus lastSeen profilePic _id")
    //   .sort({ updatedAt: -1 });

    let conversations = await Conversation.find({ members: userId })
      .populate("members", "fullName onlineStatus lastSeen profilePic _id")
      .sort({ updatedAt: -1 })
      .lean();

    console.log(conversations);

    const finalConversations = [];

    for (const conv of conversations) {
      const userDeleted = conv.deletedBy.some(
        (id) => id.toString() === userId.toString()
      );
      const userCreated = conv.createdBy.some(
        (id) => id.toString() === userId.toString()
      );

      if (!userDeleted) {
        // ✅ User didn't delete the conversation
        if (userCreated || conv.numberOfMessages > 0) {
          finalConversations.push(conv);
        }
      } else {
        // 🟡 User deleted it → Check if new messages came after deletion

        const userDeleted = conv?.deleted?.find(
          (item) => item.by.toString() === req.user._id.toString()
        );

        const deletedAt = userDeleted?.at;
        const hasNewMessages = await Message.exists({
          conversationId: conv._id,
          createdAt: { $gt: deletedAt },
        });

        if (hasNewMessages) {
          if (userCreated || conv.numberOfMessages > 0) {
            finalConversations.push(conv);
          }
        }
      }
    }

    conversations = finalConversations;

    console.log(finalConversations)

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
      return res
        .status(403)
        .json({ message: "Not authorized to delete this conversation" });
    }

    if (conversation?.deletedBy?.includes(req.user?._id)) {
      return res.status(200).json({ message: "Conversation already deleted" });
    }

    // Soft delete: track who deleted it
    if (conversation?.deletedBy?.length > 0) {
      // Already deleted by this user, proceed to full delete
      const deletedConversation = await Conversation.findByIdAndDelete(
        conversationId
      );
      const deletedMessages = await Message.deleteMany({
        conversationId: conversationId,
      });
      return res.status(200).json({
        message: "Conversation permanently deleted",
        deletedConversation,
      });
    } else {
      // First time delete by this user
      conversation?.deletedBy?.push(req.user?._id);

      const existingIndex = conversation.deleted.findIndex(
        (item) => item?.by?.toString() === req.user?._id.toString()
      );

      if (existingIndex !== -1) {
        // Replace the existing entry
        conversation.deleted[existingIndex] = {
          by: req.user._id,
          at: Date.now(),
        };
      } else {
        // Add a new entry
        conversation.deleted.push({
          by: req.user._id,
          at: Date.now(),
        });
      }

      await conversation.save();

      return res.status(200).json({
        message: "Conversation deleted for current user",
        conversation,
      });
    }
  } catch (error) {
    console.error("Delete conversation error:", error);
    return res
      .status(500)
      .json({ message: "Server error while deleting conversation" });
  }
}

export async function createConversation(req, res) {
  try {
    const { senderId, receiverId } = req.body;

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      return res.status(400).json({ message: "Invalid sender or receiver ID" });
    }

    // Check for existing conversation
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId], $size: 2 },
    }).populate("members", "fullName onlineStatus lastSeen profilePic _id");

    if (conversation) {
      // If soft-deleted by sender, restore it
      if (conversation.deletedBy?.includes(senderId)) {
        conversation.deletedBy = [];

        await conversation.save();

        return res.status(200).json({
          message: "Conversation restored",
          conversation,
        });
      }

      conversation.createdBy.push(senderId);
      await conversation.save();

      return res.status(200).json({
        message: "Conversation already exists",
        conversation,
      });
    }

    // Create new conversation
    const newConversation = await Conversation.create({
      members: [senderId, receiverId],
      createdBy: [senderId],
    });

    const createdConversation = await Conversation.findById(
      newConversation._id
    ).populate("members", "fullName onlineStatus lastSeen profilePic _id");

    return res.status(201).json({
      message: "Conversation created successfully",
      conversation: createdConversation,
    });
  } catch (error) {
    console.error("Error in createConversation controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
