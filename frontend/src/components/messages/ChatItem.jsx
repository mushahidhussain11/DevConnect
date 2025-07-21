import React from "react";
import { formatDistanceToNow } from "date-fns";

const ChatItem = ({ message, isOwnMessage }) => {
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), {
    addSuffix: true,
  });

  

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-8 `}>
      <div
        className={`max-w-xs sm:max-w-md px-4  py-2 rounded-2xl text-sm shadow-sm break-words
          ${isOwnMessage
            ? "bg-[#4C68D5] text-white rounded-br-none mr-[-1rem]"
            : "bg-gray-100 text-gray-800 rounded-bl-none ml-[-1rem]"}`}
      >
        <div>{message.text}</div>
        <div className={`text-[10px] mt-1 text-right ${isOwnMessage ? "text-[#e0e7ff]" : "text-gray-500"}`}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
