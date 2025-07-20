import React from "react";
import { FaRobot } from "react-icons/fa";

const ConversationItem = ({ conversation, onSelect }) => {
  const { name, isAI, online, lastSeen, profilePic } = conversation;

  return (
    <div
      onClick={onSelect}
      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-[#EDF1FC] transition-all duration-200 group"
    >
      <div className="relative w-10 h-10">
        {isAI ? (
          <div className="w-10 h-10 rounded-full overflow-hidden bg-white  flex items-center justify-center">
            <img
              src="/assets/images/brandLogo.png"
              alt="DevConnect Logo"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <img
            // src={profilePic || "/user-placeholder.png"}
            src="/assets/images/image.jpg"
            alt={name}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
        )}

        {!isAI && (
          <span
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
              online ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        )}
      </div>

      <div className="flex-1">
        <div className="text-sm font-semibold group-hover:text-[#4C68D5] transition">
          {name}
        </div>
        {!isAI && (
          <div className="text-xs text-gray-500">
            {online ? "Online" : `Last seen: ${lastSeen}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationItem;
