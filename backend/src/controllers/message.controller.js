import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import mongoose from "mongoose";
import { getAIResponse } from "../utils/aiAPI.js";
import "dotenv/config";
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

      newConversation.numberOfMessages = newConversation.numberOfMessages + 1;
      await newConversation.save();
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

    conversation.numberOfMessages = conversation.numberOfMessages + 1;

    conversation.deletedBy = [];
    await conversation.save();

    conversation.updatedAt = Date.now();
    await conversation.save();

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

    // Step 1: Get the conversation
    const conversation = await Conversation.findById(conversationId);

    // Step 2: Find when the current user deleted the conversation
    const deletion = conversation.deleted.find(
      (d) => d.by.toString() === req.user._id.toString()
    );

    // Step 3: Query messages after deletion time (if deleted)
    const messages = await Message.find({
      conversationId,
      ...(deletion?.at && { createdAt: { $gt: deletion.at } }), // Only apply filter if user has deleted
    });

    return res
      .status(200)
      .json({ message: "Messages fetched successfully", messages });
  } catch (error) {
    console.log("Error in get messages by conversation controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function  sendAIMessage  (req, res){
  const { conversationId, senderId,receiverId,  text } = req.body;


  const AI_ID = process.env.AI_ID || "64b7f7f96fdd1c0001a0a1a1"

  try {

    let convId = conversationId;

    console.log(conversationId)

    // Step 1: Create new conversation if not exists
    let conversation;
    if (!conversationId) {
      conversation = new Conversation({
        members: [senderId, AI_ID],
        isAI: true,
      });
      await conversation.save();
      convId = conversation._id;
    } else {
      conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
    }

    
    let aiMessage = {
      text: "Daily requests limit has been reached. Please try again tomorrow.",
    };
    // Step 3: Get AI response using OpenRouter
    const aiText = await getAIResponse(text);

    // const aiText = "Response From AI"
    

    if(!aiText) return res.status(200).json({aiMessage})

    // Step 2: Save user message
    const userMessage = new Message({
      conversationId: conversation._id,
      senderId,
      receiverId,
      text,
    });

    conversation.numberOfMessages = conversation.numberOfMessages + 1;
     await conversation.save();

    await userMessage.save();

   

    // Step 4: Save AI response
  aiMessage = new Message({
      conversationId: conversation._id,
      senderId: AI_ID,
      receiverId: senderId,
      text: aiText,
    });

    await aiMessage.save();

    // Step 5: Update conversation
    conversation.numberOfMessages = conversation.numberOfMessages + 1;
    await conversation.save();

    // Step 5: Send back both messages
    res.status(200).json({
      aiMessage,
      conversation
    });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }

  
};

