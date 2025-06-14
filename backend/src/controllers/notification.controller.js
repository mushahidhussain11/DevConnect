import Notification from "../models/notification.model.js";
// export async function sendNotification(req,res) {

//     const {senderId,receiverId,type} = req.body

//     try {

//         if(!senderId || !receiverId || !type) return res.status(400).json({message:"All fields are required"});

//         const notification = await Notification.create({senderId,receiverId,type});

//         res.status(201).json({message:"Notification sent successfully",notification});

//     }catch (error) {
//         console.log("Error in send notification controller",error);
//         res.status(500).json({message:"Internal server error"});
//     }
  
// }