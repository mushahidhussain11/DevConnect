import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import generateUsername from "../utils/usernameGenerator.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";
import crypto from "crypto";
import  cloudinary  from "../utils/cloundinary.config.js"

export async function signup(req, res) {
  const { fullName, username, email, password } = req.body;

  let {profilePic} = req.body;

  try {
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password should be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }


    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      fullName,
      username,
      email,
      password,
      profilePic: randomAvatar,
    });

    generateTokenAndSetCookie(newUser, res);

    const responseUser = newUser.toObject();
    delete responseUser.password;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: responseUser,
    });
  } catch (error) {
    console.log("Error in sign up controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req, res) {

  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if(user?.googleId || user?.facebookId) return res.status(400).json({message:"Login with google or facebook"});


    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    

    generateTokenAndSetCookie(user, res);

    

    const responseUser = user.toObject();
    delete responseUser.password;

    res
      .status(201)
      .json({ success: true, message: "Login successful", user: responseUser });
  } catch (error) {
    console.log("Error in login controller");
    res.status(500).json({ message: "Internal Server Errro" });
  }
}

export async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.googleId || user.facebookId) {
      return res
        .status(400)
        .json({ message: "O Auth users can not reset password" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 10 * 60 * 60 * 1000; // 1hour ;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // sending reset mail to user's email

    // await sendPasswordResetEmail(
    //   user.email,
    //   `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    // );

    res
      .status(200)
      .json({ message: "Password reset token sent to your email" });
  } catch (error) {
    console.log("Error in forgotPassword controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm password does not match" });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // update password
    

   

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    // await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function socialAuth(req, res) {
  const { provider, token } = req.body;
  // const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  try {
    let userInfo = {};
    let responseUser = {};
    let img = "";

    if (!provider || !token) {
      return res
        .status(400)
        .json({ message: "Provider and Token are required" });
    }

    if (provider == "google") {
      
      // Verify Google token
      try {

      const googleRes = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const payload = googleRes.data;

      
      const username = generateUsername(payload.name, payload.email);

      if(payload?.picture){
        const uploadedResponse = await cloudinary.uploader.upload(payload.picture);
			  img = uploadedResponse.secure_url;
      }

      userInfo = {
        username,
        email: payload.email,
        fullName: payload.name,
        profilePic: img,
        googleId: payload.sub,
      };

      } catch (error) {
        console.log("Error in google auth", error);
        res.status(401).json({ message: "Invalid or Expire Token" });

      }
    } else if (provider == "facebook") {
      // Verify Facebook Token
      try {
        const fbRes = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`
      );

      const fbData = fbRes.data;

      if(fbData?.picture?.data?.url){
        const uploadedResponse = await cloudinary.uploader.upload(fbData.picture.data.url);
        img = uploadedResponse.secure_url;
      }
      const username = generateUsername(fbData.name, fbData.email);

      userInfo = {
        email: fbData.email,
        username,
        fullName: fbData.name,
        profilePic: img,
        facebookId: fbData.id,
      };

      } catch (error) {
        console.log("Error in facebook auth", error);
        res.status(401).json({ message: "Invalid or Expired Token" });
      }
    }

    // Check If User Exists

    const user = await User.findOne({ email: userInfo.email });

    if (!user) {
      const newUser = await User.create(userInfo);
      responseUser = newUser.toObject();
    }

    if (user) {
      responseUser = user.toObject();
    }

    generateTokenAndSetCookie(responseUser, res);
    res.status(201).json({
      success: true,
      message: "User authentication has been successful",
      user: responseUser,
    });
  } catch (error) {
    console.log("Error in social auth controller", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}

export async function logout(req, res) {
  console.log("logout");
  res.clearCookie("jwt", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // must match
  sameSite: "strict",                            // must match
});
  console.log("bbefore sending response logout");
  res.status(200).json({ message: "Logout successful" });
}

export async function getMe(req,res) {
  const userId = req.user?._id;
  try {
    const user = await User.findById(userId).select("-password");
    res.status(200).json({ message: "User fetched successfully", user });
  } catch (error) {
    console.log("Error in getMe Controller", error);
    res.status(500).json({ message: "Internal server Error" });
  }
}
