import { useRef, useState, useEffect } from "react";
import { X, Github, Globe, Tags, ImagePlus, Layers, FolderKanban } from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";

const EditProjectModal = ({
  showEditModal,
  setShowEditModal,
  initialProjectData,
  handleUpdateProject,
  isUpdating
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
    setRemovedImages([...removedImages, imagePreview[index] ]);
    const updatedPreviews = [...imagePreview];
    const updatedFiles = [...imageFiles];
    updatedPreviews.splice(index, 1);
    updatedFiles.splice(index, 1);
    setImagePreview(updatedPreviews);
    setImageFiles(updatedFiles);
  };

  const handleSubmit = () => {
    handleUpdateProject(editForm, techStack, tags, imageFiles,removedImages);
  };

  if (!showEditModal) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex justify-center items-center px-4 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
          <FolderKanban className="text-primary-500" size={28} /> Edit Project
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={editForm.title}
            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-1 ring-primary focus:outline-none"
          />

          <textarea
            name="description"
            placeholder="Project Description"
            rows="4"
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            className="w-full border border-gray-200 scrollbar-hide rounded-lg px-4 py-2 focus:ring-1 ring-primary focus:outline-none resize-none"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Layers className="text-primary" />
              <input
                type="text"
                placeholder="Add Tech Stack (Press Enter)"
                value={inputTech}
                onChange={(e) => setInputTech(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (addItem(setTechStack, techStack, inputTech), setInputTech(""))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 ring-primary focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Tags className="text-green-600" />
              <input
                type="text"
                placeholder="Add Tags (Press Enter)"
                value={inputTag}
                onChange={(e) => setInputTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (addItem(setTags, tags, inputTag), setInputTag(""))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 ring-green-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {techStack.map((tech, idx) => (
              <span key={idx} className="bg-primary text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                {tech} <X size={14} onClick={() => removeItem(setTechStack, techStack, idx)} className="cursor-pointer" />
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                {tag} <X size={14} onClick={() => removeItem(setTags, tags, idx)} className="cursor-pointer" />
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Github className="text-gray-700" />
              <input
                type="text"
                name="repoLink"
                placeholder="GitHub Repo URL"
                value={editForm.repoLink}
                onChange={(e) => setEditForm({ ...editForm, repoLink: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 ring-primary focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Globe className="text-blue-500" />
              <input
                type="text"
                name="liveDemoLink"
                placeholder="Live Demo URL"
                value={editForm.liveDemoLink}
                onChange={(e) => setEditForm({ ...editForm, liveDemoLink: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 ring-primary focus:outline-none"
              />
            </div>
          </div>

          {imagePreview.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {imagePreview.map((src, idx) => (
                <div key={idx} className="relative">
                  <img src={src} alt="Preview" className="rounded-xl border object-cover h-32 w-full" />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-white p-1 rounded-full shadow text-gray-600 hover:bg-gray-100"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              onClick={() => inputRef.current.click()}
              className="flex items-center gap-2 text-primary hover:text-primary text-sm font-medium"
            >
              <ImagePlus size={18} /> Upload Thumbnails
            </button>

            <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 flex items-center relative left-40 text-sm rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              

            <button
              onClick={handleSubmit}
              disabled={isUpdating}
              className="bg-primary hover:bg-primary/90 text-white text-sm px-6 py-2 rounded-lg shadow flex items-center gap-2"
            >
              {isUpdating ? <><LoadingSpinner className="w-4 h-4" /><span>Updating</span></> : "Save Changes"}
            </button>
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
    </div>
  );
};

export default EditProjectModal;