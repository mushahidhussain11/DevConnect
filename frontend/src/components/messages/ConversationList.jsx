import React, { useState, useEffect } from "react";
import ConversationItem from "./ConversationItem";
import CreateConversationModal from "../CreateConversationModal";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOtherUsers,

} from "../../features/user/userSlice";
import { fetchUserConversations, createConversationWithUser, } from "../../features/messages/messagesSlice";

const ConversationList = ({ onSelect }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [userConversations, setUserConversations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);

  const aiConversation = {
    id: "ai",
    name: "DevConnect AI",
    isAI: true,
  };

  // Fetch all other users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await dispatch(getAllOtherUsers(user?.user?._id)).unwrap();
        setUsers(response?.users || []);
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };

    if (user?.user?._id) fetchUsers();
  }, [dispatch, user?.user?._id]);

  // Fetch user conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoadingConversations(true);
        const response = await dispatch(fetchUserConversations(user?.user?._id)).unwrap();
        setUserConversations(response?.conversations || []);
      } catch (error) {
        console.log("Error fetching conversations:", error);
      } finally {
        setIsLoadingConversations(false);
      }
    };

    if (user?.user?._id) fetchConversations();
  }, [dispatch, user?.user?._id]);

  // Handle starting new conversation
  const handleStartConversation = async (selectedUser) => {
    console.log(selectedUser)
    console.log(userConversations)
    const existing = userConversations.find((conv) =>
      conv?.members?.find((member) => member._id === selectedUser._id)
    );


    if (existing) {
      onSelect(existing);
      return;
    }

    try {

      const payload = {
        senderId: user?.user?._id,
        receiverId: selectedUser._id,
      };

      const response = await dispatch(createConversationWithUser(payload)).unwrap();

      if (response?.conversation) {
        setUserConversations((prev) => [response.conversation, ...prev]);
        onSelect(response.conversation);
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  return (
    <div className="w-full max-h-full overflow-y-auto scrollbar-hide px-3 py-1 items-start justify-start">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-base font-bold text-gray-800 tracking-wide">
          Conversations
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 text-xs font-medium text-white bg-gradient-to-r from-primary to-indigo-600 hover:from-primary hover:to-indigo-700 px-2.5 py-1 rounded-lg shadow-sm transition duration-200 cursor-pointer"
        >
          <span className="text-base">＋</span> New
        </button>
      </div>

      {/* Always show AI chat */}
      <div className="mb-3">
        <ConversationItem
          key={aiConversation.id}
          conversation={aiConversation}
          onSelect={() => onSelect(aiConversation)}
        />
        <div className="border-t border-gray-200 mt-3" />
      </div>

      {/* Show user conversations */}
      <div className="space-y-2">
        {userConversations.map((conv) => (
          <ConversationItem
            key={conv._id}
            conversation={conv}
            onSelect={() => onSelect(conv)}
          />
        ))}
      </div>

      {/* Modal */}
      <CreateConversationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={users}
        onStartConversation={handleStartConversation}
      />
    </div>
  );
};

export default ConversationList;
