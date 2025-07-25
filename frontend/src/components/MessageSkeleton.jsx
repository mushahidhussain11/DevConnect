import React from "react";

const MessageSkeleton = ({ isOwnMessage = false }) => {
  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xs sm:max-w-md px-4 py-2 rounded-2xl text-sm shadow-sm break-words animate-pulse
          ${isOwnMessage
            ? "bg-[#4C68D5] text-white rounded-br-none mr-[-1rem]"
            : "bg-gray-100 text-gray-800 rounded-bl-none ml-[-1rem]"}`}
      >
        {/* Single message bar placeholder */}
        <div className={`h-3 w-40 ${isOwnMessage ? "bg-indigo-300" : "bg-gray-200"} rounded`}></div>

        {/* Timestamp placeholder */}
        <div
          className={`mt-2 h-2 w-16 rounded ${
            isOwnMessage ? "bg-indigo-300" : "bg-gray-200"
          } ml-auto`}
        ></div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
