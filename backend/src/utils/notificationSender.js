import Notification from "../models/notification.model.js";
export async function sendNotification(senderId,receiverId,type,postId,projectId) {


    try {

        if(!senderId || !receiverId || !type)  {
            throw new Error('Missing notification parameters');
        }

        const notification = await Notification.create({senderId,receiverId,type,postId,projectId});

        return notification

    } catch (error) {
        console.log("Error in send notification controller",error);
        res.status(500).json({message:"Internal server error"});
    }
}