import { useRef, useState } from "react";
import {
  X,
  Github,
  Globe,
  Tags,
  ImagePlus,
  Plus,
  FolderKanban,
  Layers,
} from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { createProject } from "../../features/projects/projectsSlice";
import { incrementProjectCount } from "../../features/auth/authSlice";
import LoadingSpinner from "../LoadingSpinner";

const ProjectUploader = () => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
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
  const inputRef = useRef(null);
  const [isProjectCreating, setIsProjectCreating] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Reusable add function
const handleAddItem = (setter, list, value, clearInput) => {
  const trimmed = value.trim();
  if (trimmed && !list.includes(trimmed)) {
    setter([...list, trimmed]);
    clearInput("");
  }
};


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
    setImageFiles(files);
  };

  const removeImage = (index) => {
    const updatedPreviews = [...imagePreview];
    const updatedFiles = [...imageFiles];
    updatedPreviews.splice(index, 1);
    updatedFiles.splice(index, 1);
    setImagePreview(updatedPreviews);
    setImageFiles(updatedFiles);
  };

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

  const handleCreateProject = async () => {
    const { title, description, repoLink, liveDemoLink } = form;
    if (!title || !description)
      return toast.error("Title and Description are required");

    setIsProjectCreating(true);
    const formData = new FormData();

    imageFiles.forEach((file) => formData.append("images", file));
    formData.append("title", title);
    formData.append("description", description);
    formData.append("repoLink", repoLink);
    formData.append("liveDemoLink", liveDemoLink);
    techStack.forEach((t) => formData.append("techStack[]", t));
    tags.forEach((t) => formData.append("tags[]", t));

    try {
      await dispatch(createProject({ formData })).then(() => {
        dispatch(incrementProjectCount());
      });
      toast.success("Project created successfully");
      setForm({ title: "", description: "", repoLink: "", liveDemoLink: "" });
      setTechStack([]);
      setTags([]);
      setImagePreview([]);
      setImageFiles([]);
      setInputTech("");
      setInputTag("");
    } catch (error) {
      console.error("Project creation failed", error);
      toast.error("Failed to create project");
    } finally {
      setIsProjectCreating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-3xl mx-auto space-y-6 relative bottom-5">
      <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
        <FolderKanban className="text-primary-500" size={28} /> Publish a New
        Project
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={form.title}
          onChange={handleInputChange}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-1 ring-primary focus:outline-none"
        />

        <textarea
          name="description"
          placeholder="Project Description"
          rows="4"
          value={form.description}
          onChange={handleInputChange}
          className="w-full border border-gray-200 scrollbar-hide rounded-lg px-4 py-2 focus:ring-1 ring-primary focus:outline-none resize-none"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Layers className="text-primary" />
            <input
              type="text"
              placeholder="Add Tech Stack"
              value={inputTech}
              onChange={(e) => setInputTech(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddItem(
                    setTechStack,
                    techStack,
                    inputTech,
                    setInputTech
                  );
                }
              }}
              onBlur={(e) => {
                e.preventDefault();
                handleAddItem(setTechStack, techStack, inputTech, setInputTech)
              }
              }
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 ring-primary focus:outline-none"
            />
            {/* <button
              type="button"
              onClick={() =>
                handleAddItem(setTechStack, techStack, inputTech, setInputTech)
              }
              className="text-sm px-2 py-1 bg-primary text-white rounded"
            >
              <Plus size={16} width={18} height={18} />
            </button> */}
          </div>
          <div className="flex items-center gap-2">
            <Tags className="text-green-600" />
            <input
              type="text"
              placeholder="Add Tags (Press Enter)"
              value={inputTag}
              onChange={(e) => setInputTag(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (addItem(setTags, tags, inputTag), setInputTag(""))
              }
               onBlur={() => handleAddItem(setTags, tags, inputTag, setInputTag)}
              
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 ring-primary
               focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {techStack.map((tech, idx) => (
            <span
              key={idx}
              className="bg-primary text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
            >
              {tech}{" "}
              <X
                size={14}
                onClick={() => removeItem(setTechStack, techStack, idx)}
                className="cursor-pointer"
              />
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm flex items-center gap-1"
            >
              {tag}{" "}
              <X
                size={14}
                onClick={() => removeItem(setTags, tags, idx)}
                className="cursor-pointer"
              />
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
              value={form.repoLink}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 ring-primary focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Globe className="text-blue-500" />
            <input
              type="text"
              name="liveDemoLink"
              placeholder="Live Demo URL"
              value={form.liveDemoLink}
              onChange={handleInputChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-1 ring-primary
               focus:outline-none"
            />
          </div>
        </div>

        {imagePreview.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {imagePreview.map((src, idx) => (
              <div key={idx} className="relative">
                <img
                  src={src}
                  alt="Preview"
                  className="rounded-xl border object-cover h-32 w-full"
                />
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
            onClick={handleCreateProject}
            disabled={isProjectCreating}
            className="bg-primary hover:bg-primary/90 text-white text-sm px-6 py-2 rounded-lg shadow flex items-center gap-2"
          >
            {isProjectCreating ? (
              <>
                <LoadingSpinner className="w-4 h-4" />
                <span>Publishing</span>
              </>
            ) : (
              "Publish"
            )}
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
  );
};

export default ProjectUploader;
