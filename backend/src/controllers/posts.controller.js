import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { sendNotification } from "../utils/notificationSender.js";
import cloudinary from "../utils/cloundinary.config.js";
import mongoose from "mongoose";
import fs from "fs"
import { deletePostComments } from "./comments.controller.js";

export async function createPost(req, res) {

  console.log("Creat post is hitting")

  const {text } = req.body
  
  let image = req?.file
  let imageURL = null;

  try {

    if(!text && !image){
      return res.status(400).json({message: "Text or Image is required"})
    }

    

    if(image){
      const uploadedResponse = await cloudinary.uploader.upload(image.path);
      imageURL = uploadedResponse.secure_url;


      fs.unlink(req?.file.path, (err) => {
        if (err) {
          console.error("Failed to delete local image:", err);
        } else {
          console.log("Local image deleted successfully");
        }
      });


    }

    

    const post = await Post.create({text, image:imageURL, userId: req.user?._id})

    const user = await User.findById(req.user?._id)
    user.numberOfPosts = user.numberOfPosts + 1
    await user.save()
    
    const createdPost = await Post.findById(post?._id).populate("userId" ,"username fullName role profilePic _id");

    res.status(200).json({message: "Post created successfully", createdPost})

  } catch (error) {
    console.log("Error in create post controller", error);
    res.status(500).json({ message: "Internal server error" });
  }

}
export async function getAllPosts(req, res) {


  try {

    const posts = await Post.find({}).populate("userId" ,"username fullName role profilePic _id").sort({createdAt:-1})

    res.status(200).json({message: "Posts fetched successfully", posts})

  } catch (error) {
     console.log("Error in fetching all posts controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
  
}
export async function getPostsById(req, res) {
  const {id} = req.params
  try {

    const posts = await Post.find({userId:id}).sort({createdAt:-1}).populate("userId" ,"username fullName role profilePic _id")

    res.status(200).json({message: "Posts fetched successfully", posts})

  } catch (error) {

  }
  
}
export async function updatePost(req, res) {
console.log("update post is hitting")
  const {id} = req.params;

  const {text} = req.body

  const image = req?.file;

  try {

    if(!(mongoose.Types.ObjectId.isValid(id)) ) return res.status(400).json({message:"Invalid post id"});

    const post  = await Post.findById(id)

    
    if(!post) return res.status(400).json({message:"Post not found"});

    if(!(post?.userId.equals(req.user?._id))) return res.status(400).json({message:"You are not authorized to update this post"});


    if(text) post.text = text;

    if(image){

      if(post?.image){
        await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0])
      }

      const uploadedResponse = await cloudinary.uploader.upload(image.path);
      post.image = uploadedResponse.secure_url;

      fs.unlink(req?.file.path, (err) => {
        if (err) {
          console.error("Failed to delete local image:", err);
        } else {
          console.log("Local image deleted successfully");
        }
      });

      
    }

    await post.save()

    const updatedPost = await Post.findById(id).populate("userId" ,"username fullName role profilePic _id");

     
    

    res.status(200).json({message: "Post updated successfully", updatedPost})

  } catch (error) {
    console.log("Error in update post controller", error);
    res.status(500).json({ message: "Internal server error" });

  }
  
}
export async function deletePost(req, res) {

  const {id} = req.params;
  const cuserId = req.user?._id

  try {

    if(!(mongoose.Types.ObjectId.isValid(id)) ) return res.status(400).json({message:"Invalid post id"});

    const post  = await Post.findById(id)
    if(!post) return res.status(400).json({message:"Post not found"});

    const user = await User.findById(cuserId)

    if(!user) return res.status(400).json({message:"User not found"});

    
    if(!(post?.userId.equals(cuserId))) return res.status(400).json({message:"You are not authorized to delete this post"});

    if(post?.image){
      await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0])
    }

    const deletedPost = await Post.findByIdAndDelete(id)

    user.numberOfPosts = user.numberOfPosts - 1
    await user.save()

    await deletePostComments(id)

    res.status(200).json({message: "Post deleted successfully", deletedPost})

  } catch (error) {
    console.log("Error in delete post controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
  
}
export async function reactToPost(req, res) {
  console.log("reat to  post is hitting")
  const postId = req.params.id;
  const userId = req.user._id;
  const {typeOfReaction} = req.body;
  let isReacted = false
  let typeOfReactionAlreadyGiven = ""

  try {

    if(!(mongoose.Types.ObjectId.isValid(postId)) ) return res.status(400).json({message:"Invalid post id"});

    const post  = await Post.findById(postId)
    if(!post) return res.status(400).json({message:"Post not found"});
   
    for(let key in post?.reactions){
      post.reactions[key] = Array.isArray(post.reactions[key]) ? post.reactions[key] : [];
      if(post.reactions[key].includes(userId)){
        isReacted = true
        typeOfReactionAlreadyGiven = key
      }
    }


    if(isReacted){
      post.reactions[typeOfReactionAlreadyGiven].pull(userId)
      if(typeOfReactionAlreadyGiven !== typeOfReaction){
        post.reactions[typeOfReaction].push(userId)
      }
    }else{
      post.reactions[typeOfReaction].push(userId)
      
      if(!(post?.userId.equals(userId))){
        await sendNotification(userId,post.userId,typeOfReaction,postId,null) 
      }
    }



    await post.save()

    res.status(200).json({message: "Post reacted successfully", post})
    

  } catch (error) {
    console.log("Error in react to post controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
  
}

