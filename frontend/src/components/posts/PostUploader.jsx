import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { createPost } from "../../features/posts/postsSlice";
import LoadingSpinner from "../LoadingSpinner";

const PostUploader = () => {
  const dispatch = useDispatch();

  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const inputRef = useRef(null);
  const [isPostCreating, setIsPostCreating] = useState(false);
  const [postText, setPostText] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    inputRef.current.value = null;
  };

  const handleCreatePost = async () => {
    if (!postText && !imageFile)
      return toast.error("Text or Image is required");
    setIsPostCreating(true);
    const formData = new FormData();

    if (imageFile) formData.append("image", imageFile);
    if (postText) formData.append("text", postText);

    try {
      await dispatch(createPost({ formData }));
      toast.success("Post created successfully");
      setPostText("");
      removeImage();
      setImageFile(null);
    } catch (error) {
      console.log("Error in creating post", error);
      toast.error("Failed to create post");
    } finally {
      setIsPostCreating(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 space-y-4">
      {/* Post Text */}
      <textarea
        className="w-full resize-none border-none outline-none text-sm text-gray-800 placeholder:text-gray-400"
        rows="3"
        placeholder="What's on your mind?"
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
      />

      {/* Image Preview */}
      {image && (
        <div className="relative w-full">
          <img
            src={image}
            alt="Preview"
            className="w-full h-auto rounded-lg object-cover border border-gray-300"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 bg-white p-1 rounded-full shadow text-gray-600 hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Upload Controls */}
      <div className="flex justify-between items-center">
        {/* Upload Icon */}
        <button
          onClick={() => inputRef.current.click()}
          className="flex items-center gap-1 text-[#4C68D5] hover:text-[#3c56b0] text-sm font-medium"
        >
          <ImagePlus size={18} />
          Add Image
        </button>

        {/* Post Button */}
        <button
          onClick={handleCreatePost}
          disabled={isPostCreating}
          className="bg-[#4C68D5] hover:bg-[#3c56b0] text-white text-sm px-4 py-1.5 rounded-md shadow-sm flex items-center gap-2"
        >
          {isPostCreating ? (
            <>
              <LoadingSpinner className="w-4 h-4" />
              <span>Posting</span>
            </>
          ) : (
            "Post"
          )}
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />
    </div>
  );
};

export default PostUploader;
