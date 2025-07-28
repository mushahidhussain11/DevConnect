import React, { useState, useEffect } from "react";
import ConversationItem from "./ConversationItem";
import CreateConversationModal from "../CreateConversationModal";
import { useDispatch, useSelector } from "react-redux";
import { getAllOtherUsers } from "../../features/user/userSlice";
import { MessageCircleOffIcon } from "lucide-react";
import { createConversationWithUser } from "../../features/messages/messagesSlice";
import LoadingSpinner from "../LoadingSpinner";
import { toast } from 'react-hot-toast';

import { motion } from "framer-motion";

import ConversationSkeleton from "../ConversationSkeleton";

const ConversationList = ({
  onSelect,
  selectedConversation,
  userConversations,
  isLoadingConversations,
  setSelectedConversation,
  setUserConversations,
}) => {


  console.log(userConversations);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConversationCreating, setIsConversationCreating] = useState(false);
  const [userAIConversation, setUserAIConversation] = useState(null);
  const [currentUserConversations,setCurrentUserConversations] = useState([]);


  useEffect(() => {
  const aiConv = userConversations?.find((conv) => conv?.isAI == true);
  setUserAIConversation(aiConv);
}, [userConversations]);




  useEffect(() => {
  const convs = userConversations?.filter((conv) => conv?.isAI !== true);
  setCurrentUserConversations(convs);
}, [userConversations]);


// console.log(userConversations);


  const aiConversation = {
    id: "ai",
    name: "DevConnect AI",
    isAI: true,
  };

  // Fetch all other users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await dispatch(
          getAllOtherUsers(user?.user?._id)
        ).unwrap();
        setUsers(response?.users || []);
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };

    if (user?.user?._id) fetchUsers();
  }, [dispatch, user?.user?._id]);

  // Fetch user conversations

  // Handle starting new conversation
  const handleStartConversation = async (selectedUser) => {
    const existing = userConversations.find((conv) =>
      conv?.members?.find((member) => member._id === selectedUser._id)
    );

    console.log(existing);

    if (existing) {
      setUserConversations((prev) => [existing, ...prev]);
      onSelect(existing);
      return;
    }

    try {
      setIsConversationCreating(true);
      const payload = {
        senderId: user?.user?._id,
        receiverId: selectedUser._id,
      };

      const response = await dispatch(
        createConversationWithUser(payload)
      ).unwrap();

      if (response?.conversation) {
        setUserConversations((prev) => [response?.conversation, ...prev]);
        onSelect(response?.conversation);
      }
      toast.success("Conversation started successfully");
    } catch (error) {
      console.error("Error starting conversation:", error);
    } finally {
      setIsConversationCreating(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col px-3 py-1">
      {/* Header - Sticky Top */}
      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="text-base font-bold text-gray-800 tracking-wide dark:text-white">
          Conversations
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 text-xs font-medium text-white bg-gradient-to-r from-primary to-indigo-600 hover:from-primary hover:to-indigo-700 px-2.5 py-1 rounded-lg shadow-md transition duration-200"
        >
          <span className="text-base">＋</span> New
        </button>
      </div>

      {/* Scrollable conversations area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-hide space-y-3">
        {isLoadingConversations ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <ConversationSkeleton key={idx} />
          ))
        ) : (
          <div>
            {/* AI conversation pinned */}
            <div className="mb-3">
              <ConversationItem
                key={userAIConversation ? userAIConversation?._id : "ai"}
                conversation={
                  userAIConversation ? userAIConversation : aiConversation
                }
                onSelect={() =>
                  onSelect(
                    userAIConversation ? userAIConversation : aiConversation
                  )
                }
                isSelected={
                  userAIConversation
                    ? selectedConversation?._id === userAIConversation._id
                    : selectedConversation?.id === aiConversation.id
                }
                setUserConversations={setUserConversations}
              />
              <div className="border-t border-gray-200 mt-3" />
            </div>

            {/* User conversations or fallback */}
            <div className="space-y-2">
              {currentUserConversations?.length > 0 ? (
                currentUserConversations?.map((conv) => 
                  (conv.isAI!==true) && (
                    <ConversationItem
                      key={conv._id}
                      conversation={conv}
                      onSelect={() => onSelect(conv)}
                      isSelected={selectedConversation?._id === conv._id}
                      setSelectedConversation={setSelectedConversation}
                      setUserConversations={setUserConversations}
                    />
                  )
                )
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 rounded-xl border border-gray-200 bg-white/50 dark:bg-gray-800/40 backdrop-blur-lg space-y-4 transition-all duration-300">
                  <div className="bg-gradient-to-tr from-indigo-100 to-indigo-200 text-indigo-600 p-5 rounded-full shadow-md">
                    <MessageCircleOffIcon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white tracking-tight">
                    No User Conversations Yet
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                    Start a new chat and connect with someone today. Your
                    conversations will show up here once started.
                  </p>
                </div>
              )}
            </div>

            {/* Modal */}
            <CreateConversationModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              users={users}
              onStartConversation={handleStartConversation}
            />

            {isConversationCreating && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in px-4">
                <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm sm:max-w-md">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-6 h-6 border-[3px] border-primary border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        ease: "linear",
                      }}
                    />
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-800">
                      Creating Conversation
                    </h4>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
