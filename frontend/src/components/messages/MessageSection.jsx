import React, { useState, useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import DevConnectAI from "./DevConnectAI";
import { ArrowLeft } from "lucide-react";
import {
  fetchUserConversations,
} from "../../features/messages/messagesSlice";

const MessageSection = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [userConversations,setUserConversations] = useState([]);
  const [isLoadingConversations,setIsLoadingConversations] = useState(false);
   const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBack = () => {
    setSelectedConversation(null);
  };

  console.log(selectedConversation);

  // Listen for screen resizing
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenWidth < 768;
  const isTablet = screenWidth >= 768 && screenWidth < 1024;


   useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoadingConversations(true);
        const response = await dispatch(
          fetchUserConversations(user?.user?._id)
        ).unwrap();
        setUserConversations(response?.conversations || []);
      } catch (error) {
        console.log("Error fetching conversations:", error);
      } finally {
        setIsLoadingConversations(false);
      }
    };

    if (user?.user?._id) fetchConversations();
  }, [dispatch, user?.user?._id]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* Left Side: Conversation List */}
      <div
        className={`${
          selectedConversation && (isMobile || isTablet ) ? "hidden" : "block"
        } w-full lg:w-1/4 xl:w-1/4 bg-white rounded-xl shadow-md p-2 xl:p-3 lg:p-3 xl:h-[calc(100vh-6rem)] relative xl:bottom-2 lg:bottom-2 lg:h-[calc(100vh-6rem)] overflow-y-auto md:h-[calc(100vh-9rem)] sm:h-[calc(100vh-8rem)] h-[37rem] bottom-2` }
      >
        <ConversationList onSelect={handleSelectConversation} selectedConversation={selectedConversation} setSelectedConversation={setSelectedConversation} userConversations={userConversations}  isLoadingConversations={isLoadingConversations} setUserConversations={setUserConversations} />
      </div>

      {/* Right Side: Chat */}
      <div
        className={`${
          !selectedConversation && (isMobile || isTablet)
            ? "hidden"
            : "block"
        } w-full  flex-1 bg-white rounded-xl shadow-md p-4 h-[calc(100vh-6rem)] overflow-y-auto relative bottom-2`}
      >
        {(selectedConversation?.isAI==true) ? (
          <DevConnectAI handleBack={handleBack} conversation={selectedConversation} />
        ) : selectedConversation ? (
          <>
            
            <ChatWindow handleBack={handleBack} conversation={selectedConversation}  setUserConversations={setUserConversations} />
          </>
        ) : (
          <div className="hidden lg:flex flex-col items-center justify-center h-full text-gray-400">
            <div className="bg-[#E8ECF7] p-4 rounded-full shadow-sm mb-4">
              <svg
                className="w-8 h-8 text-[#4C68D5]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 8h10M7 12h6m-6 4h10M5 19l-2-2V5a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-[#4C68D5] mb-1">
              No Conversation Selected
            </h2>
            <p className="text-sm">
              Select a conversation from the left to start chatting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageSection;
