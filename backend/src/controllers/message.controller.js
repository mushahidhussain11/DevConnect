import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import mongoose from "mongoose";
export async function sendMessage(senderId, receiverId, text) {

  console.log(senderId, receiverId, text);
  try {
    if (!mongoose.Types.ObjectId.isValid(senderId))
      throw new Error("Invalid sender id");

    if (!mongoose.Types.ObjectId.isValid(receiverId))
      throw new Error("Invalid receiver id");

    const isConversationExists = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!isConversationExists) {
      const newConversation = await Conversation.create({
        members: [senderId, receiverId],
      });
      const newMessage = await Message.create({
        conversationId: newConversation._id,
        senderId,
        receiverId,
        text,
      });
      return newMessage;
    }
    
    const conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });
    const newMessage = await Message.create({
      conversationId: conversation._id,
      senderId,
      receiverId,
      text,
    });
    return newMessage;
  } catch (error) {
    console.log("Error in send message controller", error);
  }
}

export async function getMessagesByConversation(req, res) {
  const { conversationId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(conversationId))
      return res.status(400).json({ message: "Invalid conversation id" });

    const messages = await Message.find({ conversationId })
    return res
      .status(200)
      .json({ message: "Messages fetched successfully", messages });
  } catch (error) {
    console.log("Error in get messages by conversation controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}






