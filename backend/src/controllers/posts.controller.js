import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import cloudinary from "../utils/cloundinary.config.js";
export async function createPost(req, res) {

  const {text } = req.body
  let {image} = req.body

  try {

    if(!text && !image){
      return res.status(400).json({message: "Text or Image is required"})
    }

    

    if(image){
      const uploadedResponse = await cloudinary.uploader.upload(image);
      image = uploadedResponse.secure_url;
    }

    const post = await Post.create({text, image, userId: req.user?._id})

    const user = await User.findById(req.user?._id)
    user.numberOfPosts = user.numberOfPosts + 1
    await user.save()
    

    res.status(200).json({message: "Post created successfully", post})

  } catch (error) {
    console.log("Error in create post controller", error);
    res.status(500).json({ message: "Internal server error" });
  }

}

export async function getAllPosts(req, res) {

  try {

    const posts = await Post.find({}).sort({createdAt:-1})

    res.status(200).json({message: "Posts fetched successfully", posts})

  } catch (error) {

  }
  
}

export async function getPostsById(req, res) {
  const {id} = req.params
  try {

    const posts = await Post.find({userId:id}).sort({createdAt:-1})

    res.status(200).json({message: "Posts fetched successfully", posts})

  } catch (error) {

  }
  
}

export async function updatePost(req, res) {

  try {

  } catch (error) {

  }
  
}
export async function deletePost(req, res) {

  try {

  } catch (error) {

  }
  
}
export async function reactToPost(req, res) {

  try {

  } catch (error) {

  }
  
}

