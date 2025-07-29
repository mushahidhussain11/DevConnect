import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MoreVertical } from "lucide-react";
import ConversationDeleteModal from "../ConversationDeleteModal";
import { deleteConversation } from "../../features/messages/messagesSlice";
import { getLastSeen } from "../../utils/TimeHandler";

const ConversationItem = ({ conversation, onSelect, onDelete,isSelected,setSelectedConversation,setUserConversations }) => {
  console.log(conversation)
  const { isAI  } = conversation;
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();


  console.log(conversation,isSelected)
  // const [isSelected,setIsSelected] = useState(false)

  const otherUser = conversation?.members?.find(
    (member) => member._id !== user?.user?._id
  );

  const name = isAI
    ? "DevConnect AI"
    : otherUser?.fullName || "Unknown User";

  const profilePic = isAI
    ? "/assets/images/brandLogo.png"
    : otherUser?.profilePic || "/assets/images/image.jpg";

  const online = otherUser?.onlineStatus;
  const lastSeen = getLastSeen(otherUser?.lastSeen);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef(null);


  // const isCreatedByCurrentUser = conversation?.createdBy?.includes(user?.user?._id);


  // if(!isCreatedByCurrentUser && !isAI && conversation?.numberOfMessages === 0) {
  //   return null
  // }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const deleteHandler = async ()=> {

     try {

      setIsDeleting(true)
      const response = await dispatch(deleteConversation(conversation?._id)).unwrap();
    }catch (error) {
      console.log("Error in deleting conversation", error);

    } finally {
      setIsDeleting(false)
      setShowModal(false)
    }


  }

  // Delete handler
  const handleDelete = async () => {
    await deleteHandler()

    
    
    setTimeout(() => {
     setIsVisible(false);
    }, 500);

    setSelectedConversation(null);

    setUserConversations((prev) =>
      prev.filter((conv) => conv?._id !== conversation?._id)
    );
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        onClick={onSelect}
        className={`relative flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer  hover:bg-[#f1f4ff] hover:shadow-sm transition-all duration-500 group hover:border-primary/20 ${isSelected ? "bg-[#f1f4ff] shadow-sm border border-primary/20" : "bg-white backdrop-blur-sm border shadow-sm  border-gray-200"}
        ${!isVisible ? "opacity-0 scale-95" : "animate-fade-in"}`}
      >
        {/* Avatar */}
        <div className="relative w-10 h-10 shrink-0">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
            <img
              src={profilePic}
              alt={name}
              className="w-full h-full object-cover border border-gray-300 rounded-full"
            />
          </div>
          {!isAI && (
            <span
              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-[2px] border-white ${
                online ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium ${isSelected ? "text-primary" : "text-gray-800"}  truncate group-hover:text-primary transition-colors duration-150`}>
            {name}
          </div>
          {!isAI && (
            <div className="text-xs text-gray-500 truncate">
              {online ? "Online" : lastSeen}
            </div>
          )}
          {isAI && (
            <div className="text-xs text-gray-400 truncate">
              Chat with DevConnect AI
            </div>
          )}
        </div>

        {/* Menu */}
        {!isAI && (
          <div
            ref={menuRef}
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            className="p-1 rounded-full hover:bg-gray-100 z-10"
          >
            <MoreVertical size={18} className="text-gray-500" />

             {menuOpen && (
          <div className="absolute top-[-28px] right-4 w-32 bg-white shadow-lg rounded-lg border border-gray-200 z-20 animate-fade-in">
            <button
              onClick={() => {
                setShowModal(true);
                setMenuOpen(false);
                
              }}
              className="w-full px-4 py-2 text-sm text-left hover:bg-red-50 text-red-600 hover:text-red-700 transition rounded-lg"
            >
              Delete
            </button>
          </div>
        )}


          </div>
        )}

        {/* Dropdown */}
       
      </div>

      {/* Confirm Delete Modal */}
      {showModal && (
        <ConversationDeleteModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
};

export default ConversationItem;
