import User from "../models/user.model.js";
import { sendNotification } from "../utils/notificationSender.js";
import bcrypt from "bcryptjs";
import cloudinary from "../utils/cloundinary.config.js";
import fs from "fs";
export async function getSuggestedUsers(req, res) {
  const userId = req.user._id;

  try {
    const users = await User.find({
      _id: { $ne: userId },
      followers: { $nin: [userId] },
    })
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
    }).select("_id fullName username profilePic role followers");

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
    if (!userToFollowId)
      return res.status(400).json({ message: "Follower id is required" });

    if (userId.equals(userToFollowId))
      return res.status(400).json({ message: "You can't follow yourself" });

    const user = await User.findById(userId);
    const userToFollow = await User.findById(userToFollowId).select("-password");

    if (!userToFollow)
      return res.status(400).json({ message: "User to follower not found" });

    if (userToFollow.followers.includes(userId))
      return res
        .status(400)
        .json({ message: "You are already following this user" });

    userToFollow.followers.push(userId);
    await userToFollow.save();

    user.following.push(userToFollowId);
    await user.save();

    // Trrigger Notification

    await sendNotification(userId, userToFollowId, "follow",null,null);

    res.status(200).json({ message: "User followed successfully",userToFollow });
  } catch (error) {
    console.log("Error in follow user controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function unfollowUser(req, res) {
  const userId = req.user._id;
  const userToUnfollowId = req.params.id;

  try {
    if (!userToUnfollowId)
      return res
        .status(400)
        .json({ message: "User to UnFollow id is required" });

    const user = await User.findById(userId);
    const userToUnfollow = await User.findById(userToUnfollowId).select(
      "-password"
    );

    if (!userToUnfollow)
      return res.status(400).json({ message: "User to UnFollow not found" });

    if (!user.following.includes(userToUnfollowId))
      return res
        .status(400)
        .json({ message: "You are not following this user" });

    user.following.pull(userToUnfollowId);
    await user.save();

    userToUnfollow.followers.pull(userId);
    await userToUnfollow.save();

    res.status(200).json({ message: "User unfollowed successfully",userToUnfollow });
  } catch (error) {
    console.log("Error in unfollow user controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateUser(req, res) {
  const userId = req.user._id;
  const userToUpdateId = req.params.id;
  const { fullName, username, profilePic, role, password } = req.body;
  const image = req?.file;

  try {
    if (userToUpdateId !== userId.toString())
      return res.status(400).json({ message: "Unauthorized - User not found" });

    const user = await User.findById(userId);

    if (!user) return res.status(400).json({ message: "User not found" });

    if (fullName) user.fullName = fullName;
    if (username) user.username = username;

    //update in cloudinary
    if (image) {
      if (user?.profilePic) {
        await cloudinary.uploader.destroy(
          user.profilePic.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(image.path);
      user.profilePic = uploadedResponse.secure_url;

      fs.unlink(req?.file.path, (err) => {
        if (err) {
          console.error("Failed to delete local image:", err);
        } else {
          console.log("Local image deleted successfully");
        }
      });
    }

    console.log(user)

    if (role) user.role = role;

    if (password) {
      if (password.length < 6)
        return res
          .status(400)
          .json({ message: "Password must be at least 6 characters long" });
      if (user.googleId || user.facebookId)
        return res
          .status(400)
          .json({ message: "Users signed in with Google or Facebook can not update their password." });

      // const hashedPassword = await bcrypt.hash(password, 10);
      user.password = password;
    }

    user.updatedAt = Date.now();

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.log("Error in update user controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
