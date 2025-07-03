import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

const PostUploader = () => {
  const [image, setImage] = useState(null);
  const inputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    inputRef.current.value = null;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 space-y-4">
      {/* Post Text */}
      <textarea
        className="w-full resize-none border-none outline-none text-sm text-gray-800 placeholder:text-gray-400"
        rows="3"
        placeholder="What's on your mind?"
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
        <button className="bg-[#4C68D5] hover:bg-[#3c56b0] text-white text-sm px-4 py-1.5 rounded-md shadow-sm">
          Post
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
