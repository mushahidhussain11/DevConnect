import { useRef, useState, useEffect } from "react";
import { X, Github, Globe, Tags, ImagePlus, Layers, FolderKanban } from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";

const EditProjectModal = ({
  showEditModal,
  setShowEditModal,
  initialProjectData,
  handleUpdateProject,
  isUpdating,
}) => {
  const inputRef = useRef(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    repoLink: "",
    liveDemoLink: "",
  });
  const [techStack, setTechStack] = useState([]);
  const [tags, setTags] = useState([]);
  const [inputTech, setInputTech] = useState("");
  const [inputTag, setInputTag] = useState("");
  const [imagePreview, setImagePreview] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);

  useEffect(() => {
    if (initialProjectData) {
      setEditForm({
        title: initialProjectData?.title || "",
        description: initialProjectData?.description || "",
        repoLink: initialProjectData?.repoLink || "",
        liveDemoLink: initialProjectData?.liveDemoLink || "",
      });
      setTechStack(initialProjectData?.techStack || []);
      setTags(initialProjectData?.tags || []);
      setImagePreview(initialProjectData?.thumbnails || []);
    }
  }, [initialProjectData]);

  const addItem = (setter, items, input) => {
    if (input.trim() && !items.includes(input.trim())) {
      setter([...items, input.trim()]);
    }
  };

  const removeItem = (setter, items, index) => {
    const updated = [...items];
    updated.splice(index, 1);
    setter(updated);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImageFiles([...imageFiles, ...files]);
    setImagePreview([...imagePreview, ...previews]);
  };

  const removeImage = (index) => {
    setRemovedImages([...removedImages, imagePreview[index]]);
    const updatedPreviews = [...imagePreview];
    const updatedFiles = [...imageFiles];
    updatedPreviews.splice(index, 1);
    updatedFiles.splice(index, 1);
    setImagePreview(updatedPreviews);
    setImageFiles(updatedFiles);
  };

  const handleSubmit = () => {
    handleUpdateProject(editForm, techStack, tags, imageFiles, removedImages);
  };

  if (!showEditModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center px-2 ">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl h-[90vh] overflow-y-auto scrollbar-hide p-6 space-y-4 animate-fade-in xs:pb-8">
        <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
          <FolderKanban size={24} /> Edit Project
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={editForm.title}
          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-1 ring-primary focus:outline-none"
        />

        <textarea
          name="description"
          placeholder="Project Description"
          rows="4"
          value={editForm.description}
          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
          className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm resize-none focus:ring-1 ring-primary focus:outline-none"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Layers className="text-primary" size={18} />
            <input
              type="text"
              placeholder="Tech Stack (Enter to Add)"
              value={inputTech}
              onChange={(e) => setInputTech(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (addItem(setTechStack, techStack, inputTech), setInputTech(""))}
              className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm focus:ring-1 ring-primary focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Tags className="text-green-600" size={18} />
            <input
              type="text"
              placeholder="Tags (Enter to Add)"
              value={inputTag}
              onChange={(e) => setInputTag(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (addItem(setTags, tags, inputTag), setInputTag(""))}
              className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm focus:ring-1 ring-green-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {techStack.map((tech, idx) => (
            <span key={idx} className="bg-primary text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              {tech}
              <X size={12} onClick={() => removeItem(setTechStack, techStack, idx)} className="cursor-pointer" />
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
              {tag}
              <X size={12} onClick={() => removeItem(setTags, tags, idx)} className="cursor-pointer" />
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Github className="text-gray-700" size={18} />
            <input
              type="text"
              placeholder="GitHub Repo URL"
              value={editForm.repoLink}
              onChange={(e) => setEditForm({ ...editForm, repoLink: e.target.value })}
              className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm focus:ring-1 ring-primary focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Globe className="text-blue-500" size={18} />
            <input
              type="text"
              placeholder="Live Demo URL"
              value={editForm.liveDemoLink}
              onChange={(e) => setEditForm({ ...editForm, liveDemoLink: e.target.value })}
              className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-sm focus:ring-1 ring-primary focus:outline-none"
            />
          </div>
        </div>

        {imagePreview.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {imagePreview.map((src, idx) => (
              <div key={idx} className="relative">
                <img src={src} alt="Preview" className="rounded-md border object-cover h-28 w-full" />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-white p-1 rounded-full shadow text-gray-600 hover:bg-gray-100"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center gap-3 flex-wrap">
          <button
            onClick={() => inputRef.current.click()}
            className="flex items-center gap-1 text-primary hover:underline text-sm"
          >
            <ImagePlus size={16} /> Upload Thumbnails
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setShowEditModal(false)}
              className="px-3 py-1.5 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isUpdating}
              className="bg-primary hover:bg-primary/90 text-white text-sm px-4 py-1.5 rounded-md flex items-center gap-2"
            >
              {isUpdating ? (
                <>
                  <LoadingSpinner className="w-4 h-4" />
                  <span>Updating</span>
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>

        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          multiple
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default EditProjectModal;
