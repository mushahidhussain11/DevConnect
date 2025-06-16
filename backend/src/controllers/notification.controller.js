import Notification from "../models/notification.model.js";


export async function getNotifications (req,res) {
    const userId = req.params.id
    try {

        if(userId !== req.user._id.toString()) return res.status(400).json({message:"Unauthorized - User"})

        const notifications = await Notification.find({receiverId:userId}).sort({createdAt:-1})
        res.status(200).json({message:"Notifications fetched successfully",notifications})


    } catch (error) {
        console.log("Error in get Notifications controller");
        res.status(500).json({message:"Internal serevr Error"})
    }
}

export async function deleteNotification (req,res) {
    const notificationId = req.params.id
    try {

      

        const notification = await Notification.findByIdAndDelete(notificationId)
        res.status(200).json({message:"Notification deleted successfully",notification})


    } catch (error) {
        console.log("Error in get Notifications controller");
        res.status(500).json({message:"Internal serevr Error"})
    }
}