import { useState, useEffect } from "react";
import { useRef } from "react";
import useBreakpoint from "../../hooks/useBreakPoint";
import { decrementProjectCount } from "../../features/auth/authSlice";
import EditProjectModal from "./EditProjectModal";
import {
  MessageCircle,
  Send,
  Trash2,
  Pencil,
  Sparkles,
  MoreVertical,
  Github,
  Globe,
  Tags,
  Layers,
  X,
} from "lucide-react";
import { ThumbsUp, Heart } from "phosphor-react";
import { GiPartyPopper } from "react-icons/gi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchComments } from "../../features/comments/commentsSlice";
import { setAndUnsetReaction } from "../../features/projects/projectsSlice";
import { addComment } from "../../features/comments/commentsSlice";
import { deleteComment } from "../../features/comments/commentsSlice";
import DeleteCommentModal from "../DeleteCommentModal";
import LoadingSpinner from "../LoadingSpinner";
import {
  updateProject,
  deleteProject,
} from "../../features/projects/projectsSlice";
import DeleteProjectModal from "../DeleteProjectModal";
import { Link } from "react-router-dom";

const reactionTypes = [
  {
    type: "like",
    label: "Like",
    icon: <ThumbsUp weight="fill" size={24} className="text-primary" />,
    textColor: "#3b82f6",
  },
  {
    type: "love",
    label: "Love",
    icon: <Heart weight="fill" size={24} className="text-red-500" />,
    textColor: "#ef4444",
  },
  {
    type: "innovative",
    label: "Innovative",
    icon: <Sparkles size={24} className="text-primary" />,
    textColor: "#4C68D5",
  },
  {
    type: "celebrate",
    label: "Celebrate",
    icon: <GiPartyPopper size={24} color="#2ECC71" className="ml-0.5 mb-0.5" />,
    textColor: "#2ECC71",
  },
];

const Project = ({ project, currentUser }) => {
  // const isOwnPost = post.userId === currentUser.id;

  const isOwnProject = project?.userId?._id === currentUser?._id;
  let currentUserReaction = "";

  for (let key in project?.reactions) {
    if (project?.reactions[key].includes(currentUser?._id)) {
      currentUserReaction = key;
    }
  }

  const [reactions, setReactions] = useState({
    like: project?.reactions?.like?.length || 0,
    love: project?.reactions?.love?.length || 0,
    innovative: project?.reactions?.innovative?.length || 0,
    celebrate: project?.reactions?.celebrate?.length || 0,
  });

  const dispatch = useDispatch();

  const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);

  const [userReaction, setUserReaction] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [commentsAnimatingOut, setCommentsAnimatingOut] = useState(false);
  const [reactionsAnimatingOut, setReactionsAnimatingOut] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isCommentDeleting, setIsCommentDeleting] = useState(false);
  const [targetCommentId, setTargetCommentId] = useState(null);
  const [isProjectDeleting, setIsProjectDeleting] = useState(false);
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);

  const projectMenuRef = useRef();
  const isTouchDevice = useRef(false);
  const timeoutRef = useRef();
  const skipNextLeave = useRef(false);
  const reactionBoxRef = useRef(null);

  const scrollRef = useRef(null);


  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [isUpdating,setIsUpdating] = useState(false);


const handleUpdateProject = async (editForm, techStack, tags, imageFiles,removedImages) => {

  if (!editForm.title || !editForm.description) {
    toast.error("Title and description are required");
    return;
  }



  const formData = new FormData();
  formData.append("title", editForm.title);
  formData.append("description", editForm.description);
  formData.append("repoLink", editForm.repoLink || "");
  formData.append("liveDemoLink", editForm.liveDemoLink || "");

  // Append each new image
  imageFiles.forEach((file) => {
    formData.append("images", file); // backend must expect "images"
  });

  // Append techStack and tags
  techStack.forEach((tech) => {
    formData.append("techStack[]", tech);
  });



  tags.forEach((tag) => {
    formData.append("tags[]", tag);
  });


  removedImages?.forEach((image) => {

     const cleanedUrl = image.split("?")[0].split(".").slice(0, -1).join(".");
      const parts = cleanedUrl.split("/");
      const updatedImage = parts[parts.length - 1];
    formData.append("removedImages[]", updatedImage);
  });



  try {
    setIsUpdating(true);

    // Dispatch your updateProject redux action or call your API
    await dispatch(updateProject({ formData, projectId: project?._id })).unwrap();

    toast.success("Project updated successfully");
    setShowEditModal(false); // Close modal
  } catch (error) {
    console.error("Update failed:", error);
    toast.error("Failed to update project");
  } finally {
    setIsUpdating(false);
  }
};


// Example function to open modal




  // Drag state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  // Mouse Events
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollStart.current = scrollRef.current.scrollLeft;
    scrollRef.current.classList.add("cursor-grabbing");
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    scrollRef.current.classList.remove("cursor-grabbing");
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    scrollRef.current.classList.remove("cursor-grabbing");
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // multiplier for speed
    scrollRef.current.scrollLeft = scrollStart.current - walk;
  };

  useEffect(() => {
    setUserReaction(currentUserReaction);
  }, [currentUserReaction]);

  const [comments, setComments] = useState([]);

  const screen = useBreakpoint();

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);

    setShowReactions(true);
    setReactionsAnimatingOut(false);
  };

  // Delayed leave to prevent flickering
  const handleLeave = () => {
    if (skipNextLeave.current) {
      skipNextLeave.current = false;
      return;
    }

    clearTimeout(timeoutRef.current); // Clear any previous timeout

    // Delay before hiding
    timeoutRef.current = setTimeout(() => {
      setReactionsAnimatingOut(true);

      // Wait for animation to complete before hiding
      setTimeout(() => {
        setShowReactions(false);
        setReactionsAnimatingOut(false);
      }, 500); // match your fade-out animation duration
    }, 100); // delay before starting animation
  };

  const handleReaction = (type) => {
    setReactionsAnimatingOut(false);
    setShowReactions(false);

    if (userReaction) {
      setReactions((prev) => ({
        ...prev,
        [userReaction]: prev[userReaction] - 1,
      }));
    }
    setReactions((prev) => ({ ...prev, [type]: prev[type] + 1 }));
    setUserReaction(type);

    setReactionToBackend(type);
  };

  const handleTouchStart = () => {
    isTouchDevice.current = true;
    const timer = setTimeout(() => {
      setShowReactions(true); // Long press → show reactions
    }, 500);
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      if (!showReactions) {
        handleUserReaction("like"); // Short tap → quick like
      }
    }
  };

  const handleUserReaction = (type) => {
    skipNextLeave.current = true;
    setReactionsAnimatingOut(false);
    setShowReactions(false);

    if (userReaction) {
      setReactionToBackend(userReaction);
    }

    if (!userReaction) {
      setReactionToBackend(type);
    }

    if (userReaction) {
      setReactions((prev) => ({
        ...prev,
        [userReaction]: prev[userReaction] - 1,
      }));

      setUserReaction(null);
    }

    if (!userReaction) {
      setReactions((prev) => ({
        ...prev,
        [type]: prev[type] + 1,
      }));

      setUserReaction(type);
    }
  };

  const setReactionToBackend = (type) => {
    try {
      dispatch(setAndUnsetReaction({ type, projectId: project?._id }));
    } catch (error) {
      console.error("Error setting reaction:", error);
    }
  };

  const handleAddComment = async () => {
    console.log("handling comment starts here");
    let addedComment = null;
    const commentInputValue = commentInput;
    setCommentInput("");
    try {
      addedComment = await dispatch(
        addComment({ text: commentInputValue, id: project?._id })
      ).unwrap();
      addedComment = addedComment?.comment;
      toast.success("Comment added successfully");
    } catch (error) {
      toast.error("Failed to add comment");
      console.log("Error in adding comment controller", error);
    }

    if (commentInput.trim()) {
      setComments((prev) => [
        ...prev,
        {
          projectId: project?._id,
          text: addedComment?.text,
          _id: addedComment?._id,
          userId: {
            _id: currentUser?._id,
            fullName: currentUser?.fullName,
            profilePic: currentUser?.profilePic,
          },
          self: true,
        },
      ]);
    }
  };

  const handleDeleteComment = async () => {
    setShowDeleteModal(true);
  };

  const deleteCommentHandler = async (commentId) => {
    try {
      setIsCommentDeleting(true);
      await dispatch(deleteComment({ commentId })).unwrap();
      setComments((prev) =>
        prev.filter((comment) => comment?._id !== commentId)
      );
      setTargetCommentId(null);
      toast.success("Comment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete comment");
      console.log("Errro in deleting the comment", error);
    } finally {
      setShowDeleteModal(false);
      setIsCommentDeleting(false);
    }
  };

  // const handleUpdateProject = async (text, newImage) => {
  //   if (!text && !newImage)
  //     return toast.error("Project content cannot be empty");

  //   setIsProjectUpdating(true);

  //   try {
  //     // ✅ Build FormData payload
  //     const formData = new FormData();
  //     formData.append("text", text);
  //     if (newImage) {
  //       formData.append("image", newImage); // File object
  //     } // in case needed

  //     await dispatch(
  //       updateProject({ projectId: project._id, formData })
  //     ).unwrap();

  //     toast.success("Project updated successfully");
  //   } catch (error) {
  //     console.error("Error in updating the Project", error);
  //     toast.error("Failed to update project");
  //   } finally {
  //     setIsProjectUpdating(false);
  //     setShowEditModal(false);
  //   }
  // };

  const handleDeleteProject = async () => {
    setShowDeleteProjectModal(true);
    setShowProjectMenu(false);
  };

  const deleteProjectHandler = async () => {
    setIsProjectDeleting(true);

    try {
      await dispatch(deleteProject({ projectId: project?._id }))
        .unwrap()
        .then(() => {
          dispatch(decrementProjectCount());
        });
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error in deleting the project", error);
      toast.error("Failed to delete project");
    } finally {
      setShowDeleteProjectModal(false);
      setIsProjectDeleting(false);
    }
  };



















  

  useEffect(() => {
    if (screen === "sm" || screen === "md") {
      setIsMobile(true);
    }

    if (screen === "lg" || screen === "xl") {
      isTouchDevice.current = false;
    }
  }, [screen]);

  const reaction = reactionTypes.find((r) => r.type === userReaction);

  useEffect(() => {
    const fetchProjectComments = async () => {
      try {
        const response = await dispatch(fetchComments(project?._id)).unwrap();
        console.log(response.projectComments);

        setComments(
          response?.projectComments?.map((comment) => ({
            ...comment,
            self: comment.userId?._id === currentUser?._id,
          }))
        );
      } catch (error) {
        console.log("Error in fetching comments", error);
      }
    };

    fetchProjectComments();
  }, [dispatch, project?._id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        reactionBoxRef.current &&
        !reactionBoxRef.current.contains(event.target)
      ) {
        setReactionsAnimatingOut(true);

        setTimeout(() => {
          setShowReactions(false);
          setReactionsAnimatingOut(false);
        }, 500);
      }
    };

    // Use both touchstart and mousedown to support mobile + desktop
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        projectMenuRef.current &&
        !projectMenuRef.current.contains(event.target)
      ) {
        setShowProjectMenu(false); // Hide the button
      }
    };

    // Add listeners for both desktop and mobile
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow p-5 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${project?.userId?._id}`}>
            <img
              src={project?.userId?.profilePic}
              alt={project?.userId?.username}
              className="w-10 h-10 rounded-full object-cover hover:cursor-pointer"
            />
          </Link>
          <div>
            <Link to={`/profile/${project?.userId?._id}`}>
              <h4 className="font-semibold text-gray-800 hover:cursor-pointer">
                {project?.userId?.fullName}
              </h4>
            </Link>
            <p className="text-sm text-gray-500">
              {project?.userId?.role || "User"}
            </p>
          </div>
        </div>

        {/* More menu for own post */}
        {isOwnProject && (
          <div className="relative" ref={projectMenuRef}>
            <button
              onClick={() => setShowProjectMenu((prev) => !prev)}
              className="p-1 rounded-full hover:bg-gray-100 transition"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>

            {showProjectMenu && (
              <div
                className={`absolute right-0 bottom-10 w-40 bg-white border border-gray-200 shadow-lg rounded-lg z-50 animate-fade-in`}
              >
                <button
                  onClick={() => handleDeleteProject()}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50  rounded-t-lg transition"
                >
                  <Trash2 className="w-4 h-4 mr-2 inline-block" /> Delete
                  Project
                </button>

                <button
                  onClick={() => {
                    setShowEditModal(true);
                     setSelectedProject(project);
                    setShowProjectMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:text-primary text-gray-600 hover:bg-blue-50 rounded-t-lg transition"
                >
                  <Pencil className="w-4 h-4 mr-2 inline-block" /> Edit Project
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}

      <div className="space-y-6 relative top-2 w-full max-w-6xl mx-auto px-3">
        {/* Title */}
        {project?.title && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-3 h-3 bg-primary rounded-full" />
            <div className="h-0.5 w-10 bg-indigo-300 relative right-2" />
            <h2 className="text-md font-medium text-gray-600">Title:</h2>
            <h2 className="text-lg font-bold text-primary break-words">
              {project.title}
            </h2>
          </div>
        )}

        {/* Description */}
        {project?.description && (
          <div className="flex flex-col gap-2 pb-4">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-primary rounded-full" />
              <div className="h-0.5 w-10 bg-indigo-300" />
              <h2 className="text-md font-medium text-gray-600 ml-4">
                Description:
              </h2>
            </div>
            <div className="sm:pl-[calc(0.75rem+2.5rem)]">
              {" "}
              {/* aligns under bullet */}
              <p className="text-sm text-gray-600 max-w-4xl leading-relaxed xl:relative xl:left-4 text-justify lg:relative lg:left-4 md:relative md:left-4 ">
                {project.description}
              </p>
            </div>
          </div>
        )}

        {/* GitHub Repo */}
        {project?.repoLink && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-3 h-3 bg-primary rounded-full " />
            <div className="h-0.5 w-10 bg-indigo-300 relative right-2" />
            <Github className="w-5 h-5 text-gray-600" />
            <h2 className="text-md font-medium text-gray-600">GitHub Repo:</h2>
            <a
              href={project.repoLink}
              className="text-sm text-primary underline break-all"
              target="_blank"
              rel="noreferrer"
            >
              {project.repoLink}
            </a>
          </div>
        )}

        {/* Live Demo */}
        {project?.liveDemoLink && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-3 h-3 bg-primary rounded-full" />
            <div className="h-0.5 w-10 bg-indigo-300 relative right-2" />
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-md font-medium text-gray-600">Live Demo:</h2>
            <a
              href={project.liveDemoLink}
              className="text-sm text-primary underline break-all"
              target="_blank"
              rel="noreferrer"
            >
              {project.liveDemoLink}
            </a>
          </div>
        )}

        {/* Tags */}
        {project?.tags?.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-primary rounded-full" />
              <div className="h-0.5 w-10 bg-indigo-300 relative right-2" />
              <Tags className="w-5 h-5 text-green-600" />
              <h2 className="text-md font-medium text-gray-600">Tags:</h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {project.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        {project?.techStack?.length > 0 && (
          <div className="flex flex-col sm:flex-row  sm:items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-primary rounded-full" />
              <div className="h-0.5 w-10 bg-indigo-300 relative right-2" />
              <Layers className="w-5 h-5 text-primary" />
              <h2 className="text-md font-medium text-gray-600">Tech Stack:</h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {project.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs bg-primary text-white rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Thumbnails */}
        {project?.thumbnails?.length > 0 && (
          <div className="space-y-3 relative pb-8">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-primary rounded-full" />
              <div className="h-0.5 w-10 bg-indigo-300 relative right-2" />
              <h2 className="text-md font-medium text-gray-600">Thumbnails:</h2>
            </div>
            <div
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className="overflow-x-auto scrollbar-hide"
            >
              <div className="flex gap-4 snap-x snap-mandatory">
                {project.thumbnails.map((img, idx) => (
                  <img
                    draggable={false}
                    key={idx}
                    src={img}
                    alt={`Screenshot ${idx + 1}`}
                    className="w-[260px] h-[160px] object-cover rounded-xl snap-start shrink-0"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reaction summary */}
      <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
        <ThumbsUp weight="fill" size={20} className="text-primary" />
        {/* <Heart weight="fill" size={20} className="text-red-500" />
        <FaLaughSquint size={18} color="#FFCA28" />
        <GiPartyPopper size={24} color="#2ECC71" className="ml-0.5 mb-0.5" /> */}

        <span className="font-medium ml-2">{totalReactions}</span>
        <span>Reactions</span>
      </div>

      {/* Buttons */}
      <div className="flex justify-around py-1 mb-2 relative border-t border-b border-gray-300">
        {/* Like */}
        <div
          className="relative w-full"
          onMouseEnter={() => !isMobile && handleEnter()}
          onMouseLeave={() => !isMobile && handleLeave()}
          onTouchStart={() => isMobile && handleTouchStart()}
          onTouchEnd={() => isMobile && handleTouchEnd()}
        >
          {/* Like Button */}
          <div
            onClick={() => !isMobile && handleUserReaction("like")}
            className="flex items-center justify-center gap-2 text-gray-600 xl:hover:bg-[#EDF1FC] lg:hover:bg-[#EDF1FC] w-full py-2 rounded-md select-none"
          >
            {userReaction ? (
              <>
                {reaction?.icon}
                <span
                  style={{ color: reaction?.textColor }}
                  className="font-medium text-sm"
                >
                  {reactionTypes.find((r) => r.type === userReaction)?.label}
                </span>
              </>
            ) : (
              <>
                <ThumbsUp size={24} />
                <span className="text-sm">Like</span>
              </>
            )}
          </div>

          {/* Reaction Pop-up */}
          {(showReactions || reactionsAnimatingOut) && (
            <div
              ref={reactionBoxRef}
              className={`absolute bottom-11 left-1/2 -translate-x-1/2 
        bg-white border border-gray-200 rounded-2xl px-5 py-3 
        flex gap-4 shadow-xl z-30 ${
          reactionsAnimatingOut ? "animate-fade-out-down" : "animate-fade-in-up"
        }`}
            >
              {reactionTypes.map((r) => (
                <button
                  key={r.type}
                  onClick={() => handleReaction(r.type)}
                  className="hover:scale-125 transition-transform duration-150"
                >
                  {r.icon}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Comment */}
        <div
          onClick={() => {
            if (showComments) {
              setCommentsAnimatingOut(true);
              setTimeout(() => {
                setShowComments(false);
                setCommentsAnimatingOut(false);
              }, 500); // must match animation duration
            } else {
              setShowComments(true);
              setCommentsAnimatingOut(false);
            }
          }}
          className="flex items-center justify-center gap-2 text-gray-600 hover:bg-[#EDF1FC] w-full py-2 rounded-md select-none"
        >
          <MessageCircle size={20} /> Comment
        </div>
      </div>

      {/* Comments */}
      {(showComments || commentsAnimatingOut) && (
        <div
          className={`mt-4 transition-all ${
            commentsAnimatingOut
              ? "animate-fade-out-down"
              : "animate-fade-in-up"
          }`}
        >
          <h4 className="font-medium text-gray-800 mb-2">
            Comments ({comments?.length})
          </h4>
          <div className="space-y-3 max-h-56 overflow-y-auto pr-2 scrollbar-thin">
            {comments?.map((comment, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between bg-[#EDF1FC] p-3 rounded-xl"
              >
                <div className="flex gap-3">
                  <Link to={`/profile/${comment?.userId?._id}`}>
                    <img
                      src={comment?.userId?.profilePic}
                      alt={comment?.userId?.fullName}
                      className="w-8 h-8 rounded-full object-cover hover:cursor-pointer"
                    />
                  </Link>
                  <div>
                    <Link to={`/profile/${comment?.userId?._id}`}>
                      <p className="text-sm font-semibold text-gray-800 hover:cursor-pointer">
                        {comment?.userId?.fullName}
                      </p>
                    </Link>
                    <p className="text-sm text-gray-700">{comment?.text}</p>
                  </div>
                </div>
                {comment.self || project?.userId?._id === currentUser?._id ? (
                  <button
                    onClick={() => {
                      setTargetCommentId(comment?._id);
                      handleDeleteComment();
                    }}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                ) : null}
              </div>
            ))}

            {showDeleteModal && (
              <DeleteCommentModal
                isOpen={showDeleteModal}
                onClose={() => {
                  setShowDeleteModal(false);
                  setTargetCommentId(null);
                }}
                onDelete={() => deleteCommentHandler(targetCommentId)}
                isCommentDeleting={isCommentDeleting}
              />
            )}
          </div>

          {/* Comment Input */}
          <div className="mt-4 flex items-center gap-2">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent form submission or newline
                  handleAddComment();
                }
              }}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleAddComment}
              className="p-2 rounded-full bg-[#4C68D5] text-white hover:bg-[#3c56b0] transition"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {showDeleteProjectModal && (
        <DeleteProjectModal
          isOpen={showDeleteProjectModal}
          onClose={() => {
            setShowDeleteProjectModal(false);
          }}
          onDelete={() => deleteProjectHandler(project?.id)}
          isProjectDeleting={isProjectDeleting}
        />
      )}

      {/* // edit modal */}

       <EditProjectModal
      showEditModal={showEditModal}
      setShowEditModal={setShowEditModal}
      initialProjectData={selectedProject}
      handleUpdateProject={handleUpdateProject}
      isUpdating={isUpdating}
  />

    </div>
  );
};

export default Project;
