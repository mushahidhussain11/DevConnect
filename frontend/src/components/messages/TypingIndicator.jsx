import React from "react";

const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-2 mb-2">
      <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
      <div className="flex space-x-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
      </div>
    </div>
  );
};

export default TypingIndicator;
