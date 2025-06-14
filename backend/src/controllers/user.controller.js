import User from "../models/user.model.js";
import {sendNotification} from "../utils/notificationSender.js";
export async function getSuggestedUsers(req, res) {
  const userId = req.user._id;

  try {
    const users = await User.find({
      _id: { $ne: userId },
      followers: { $nin: [userId] },
    })
      .limit(5)
      .select("-password");
    res
      .status(200)
      .json({ message: "Suggested users fetched successfully", users });
  } catch (error) {
    console.log("Error in get suggested users controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getUserById(req, res) {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId).select("-password");
    res.status(200).json({ message: "User fetched successfully", user });
  } catch (error) {
    console.log("Error in getUserById Controller", error);
    res.status(500).json({ message: "Internal server Error" });
  }
}

export async function getSearchUsers(req, res) {
  console.log(req.query);

  const { name } = req.query;

  try {

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Search query is required." });
    }

    
      const users = await User.find({
        fullName: { $regex: name, $options: "i" },
      }).select("_id fullName username profilePic");

      res
        .status(200)
        .json({ message: "Search users fetched successfully", users });
     
  } catch (error) {
    console.log("Error in get search users controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function followUser(req, res) {
  const userId = req.user._id;
  const userToFollowId = req.params.id;

  try {

    if(!userToFollowId) return res.status(400).json({message:"Follower id is required"});

    if(userId.equals(userToFollowId)) return res.status(400).json({message:"You can't follow yourself"});

    const user = await User.findById(userId);
    const userToFollow = await User.findById(userToFollowId);

    
    if(!userToFollow) return res.status(400).json({message:"User to follower not found"});
    

    if(userToFollow.followers.includes(userId)) return res.status(400).json({message:"You are already following this user"});

    userToFollow.followers.push(userId);
    await userToFollow.save();

    user.following.push(userToFollowId);
    await user.save();

    // Trrigger Notification 

    await sendNotification(userId,userToFollowId,"follow");


    res.status(200).json({message:"User followed successfully"});

  } catch (error) {
    console.log("Error in follow user controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function unfollowUser(req, res) {
  

}