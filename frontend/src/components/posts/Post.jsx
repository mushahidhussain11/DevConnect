import { useState, useEffect } from "react";
import { useRef } from "react";
import useBreakpoint from "../../hooks/useBreakPoint";
import { MessageCircle, Send, Trash2,Pencil, MoreVertical } from "lucide-react";
import { ThumbsUp, Heart } from "phosphor-react";
import { FaLaughSquint } from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments } from "../../features/comments/commentsSlice";
import { setAndUnsetReaction } from "../../features/posts/postsSlice";
import {addComment} from "../../features/comments/commentsSlice";

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
    type: "funny",
    label: "Funny",
    icon: <FaLaughSquint size={24} color="#FFCA28" />,
    textColor: "#FFCA28",
  },
  {
    type: "celebrate",
    label: "Celebrate",
    icon: <GiPartyPopper size={24} color="#2ECC71" className="ml-0.5 mb-0.5" />,
    textColor: "#2ECC71",
  },
];

const Post = ({ post,currentUser }) => {
  // const isOwnPost = post.userId === currentUser.id;
 
  const isOwnPost = post?.userId?._id === currentUser?._id;
  let currentUserReaction = ""

 for(let key in post?.reactions){
  if(post?.reactions[key].includes(currentUser?._id)){
    currentUserReaction = key
  }
 }
  

  const [reactions, setReactions] = useState({
    like: post?.reactions?.like?.length || 0,
    love: post?.reactions?.love?.length || 0,
    funny: post?.reactions?.funny?.length || 0,
    celebrate: post?.reactions?.celebrate?.length || 0,
  });

  const dispatch = useDispatch();
  

  const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);

  const [userReaction, setUserReaction] = useState(null);
  console.log(userReaction)
  const [showReactions, setShowReactions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [commentsAnimatingOut, setCommentsAnimatingOut] = useState(false);
  const [reactionsAnimatingOut, setReactionsAnimatingOut] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editContent, setEditContent] = useState(post?.text);
  const [editImage, setEditImage] = useState(post?.image);
  const [newImageFile, setNewImageFile] = useState(null);

  const postMenuRef = useRef();
  const isTouchDevice = useRef(false);
  const timeoutRef = useRef();
  const skipNextLeave = useRef(false);
  const reactionBoxRef = useRef(null);

  useEffect(()=>{
    setUserReaction(currentUserReaction)
  },[currentUserReaction])
  // const [comments, setComments] = useState([
  //   {
  //     name: "Alice",
  //     text: "Great post!",
  //     avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  //     self: false,
  //   },
  //   {
  //     name: "You",
  //     text: "Nice work 👏",
  //     avatar: "https://randomuser.me/api/portraits/men/15.jpg",
  //     self: true,
  //   },
  // ]);

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

  const handleUserReaction =  (type) => {
    skipNextLeave.current = true;
    setReactionsAnimatingOut(false);
    setShowReactions(false);

    if(userReaction){
      setReactionToBackend(userReaction)
    }

    if(!userReaction){
      setReactionToBackend(type)
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

  const setReactionToBackend =  (type) => {
    
    try {
    
       dispatch(setAndUnsetReaction({ type, postId: post?._id }));
    } catch (error) {
      console.error("Error setting reaction:", error);
    }
  }

  const handleAddComment = () => {

    try {
      console.log(comments)
      console.log(commentInput, post?._id)
      dispatch(addComment({ text: commentInput, postId: post?._id }));

    }catch (error) {
      console.log("Error in adding comment controller",error);
    }

    if (commentInput.trim()) {
      setComments((prev) => [
        ...prev,
        {
          postId: post?._id,
          text: commentInput,
          userId: {
            _id: currentUser?._id,
            fullName: currentUser?.fullName,
            profilePic: currentUser?.profilePic
          }, 
          self: true,
        },
      ]);
      setCommentInput("");
    }
  };

  const deleteComment = (index) => {
    setComments((prev) => prev.filter((_, i) => i !== index));
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

  useEffect(()=>{
    const fetchPostComments =async ()=>{
      try {
        const response = await dispatch(fetchComments(post?._id)).unwrap();
        
        setComments(
  response?.postComments?.map((comment) => ({
    ...comment,
    self: comment.userId?._id === currentUser?._id,
    
  }))
);

      } catch (error) {
        console.log("Error in fetching comments", error);
      }
    }

    fetchPostComments();
  },[dispatch,post?._id])

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
      if (postMenuRef.current && !postMenuRef.current.contains(event.target)) {
        setShowPostMenu(false); // Hide the button
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
          <img
            src={post?.userId?.profilePic}
            alt={post?.userId?.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className="font-semibold text-gray-800">{post?.userId?.fullName}</h4>
            <p className="text-sm text-gray-500">{post?.userId?.role || "User"}</p>
          </div>
        </div>

        {/* More menu for own post */}
        {isOwnPost && (
          <div className="relative" ref={postMenuRef}>
            <button
              onClick={() => setShowPostMenu((prev) => !prev)}
              className="p-1 rounded-full hover:bg-gray-100 transition"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>

            {showPostMenu && (
              <div
                className={`absolute right-0 bottom-10 w-36 bg-white border border-gray-200 shadow-lg rounded-lg z-50 animate-fade-in`}
              >
                <button
                  onClick={() => {
                    toast.success("Post deleted successfully.");
                    setShowPostMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50  rounded-t-lg transition"
                >
                  <Trash2 className="w-4 h-4 mr-2 inline-block" /> Delete Post
                </button>

                <button
                  onClick={() => {
                    setShowEditModal(true);
                    setShowPostMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:text-primary text-gray-600 hover:bg-blue-50 rounded-t-lg transition"
                >
                  <Pencil className="w-4 h-4 mr-2 inline-block" /> Edit Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-gray-800 text-sm mb-3">{post?.text}</p>
      {post?.image && (
        <img
          src={post?.image}
          alt="Post"
          className="rounded-lg w-full object-cover max-h-[400px] mb-4"
        />
      )}

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
            className="flex items-center justify-center gap-2 text-gray-600 hover:bg-[#EDF1FC] w-full py-2 rounded-md select-none"
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
              console.log("hello");
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
                  <img
                    src={comment?.userId?.profilePic}
                    alt={comment?.userId?.fullName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {comment?.userId?.fullName}
                    </p>
                    <p className="text-sm text-gray-700">{comment?.text}</p>
                  </div>
                </div>
                {comment.self && (
                  <button
                    onClick={() => deleteComment(idx)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
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

      {showEditModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 flex justify-center items-center px-4 animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 space-y-4 relative">
            <h3 className="text-lg font-semibold text-gray-800">Edit Post</h3>

            {/* Text Area */}
            <textarea
  value={editContent}
  onChange={(e) => setEditContent(e.target.value)}
  className="w-full h-32 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-3 text-sm resize-none outline-none"
  placeholder="Update your post text..."
/>

            {/* Image Preview & Upload */}
            <div className="space-y-2">
              {editImage && (
                <img
                  src={
                    newImageFile ? URL.createObjectURL(newImageFile) : editImage
                  }
                  alt="Preview"
                  className="w-full rounded-md object-cover max-h-64"
                />
              )}
              <label className="block">
                <span className="text-sm text-gray-700">Change image:</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setNewImageFile(file);
                    }
                  }}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:border file:rounded-md file:text-sm file:bg-blue-50 file:text-primary hover:file:bg-blue-100"
                />
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Normally, send `editContent` & `newImageFile` to API
                  post.text = editContent;
                  if (newImageFile) {
                    const newURL = URL.createObjectURL(newImageFile);
                    post.image = newURL; // only for demo/mock
                    setEditImage(newURL);
                  }
                  toast.success("Post updated successfully.");
                  setShowEditModal(false);
                }}
                className="px-4 py-2 text-sm rounded-md bg-primary text-white hover:bg-primary-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
