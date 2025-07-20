import React from "react";
import { useState } from "react";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import DevConnectAI from "./DevConnectAI";

const MessageSection = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* Left Side: List of Conversations */}
      <div className="w-full lg:w-1/3 xl:w-1/4 bg-white rounded-xl shadow-md p-4 h-[calc(100vh-6rem)] overflow-y-auto relative bottom-2">
        <ConversationList onSelect={handleSelectConversation} />
      </div>

      {/* Right Side: Chat Window or DevConnect AI */}
      <div className="w-full flex-1 bg-white rounded-xl shadow-md p-4 h-[calc(100vh-6rem)] overflow-y-auto relative bottom-2">
        {selectedConversation?.isAI ? (
          <DevConnectAI />
        ) : selectedConversation ? (
          <ChatWindow conversation={selectedConversation} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
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
