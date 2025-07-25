import React from "react";

const TypingIndicator = ({otherUser}) => {
  console.log(otherUser)
  return (
    <div className="flex items-center  space-x-2 mb-2 mt-6 relative right-4">
      <div className="w-8 h-8 rounded-full">
        <img className="w-full h-full rounded-full" src={otherUser?.profilePic}/>
      </div>
      <div className="flex space-x-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
      </div>
    </div>
  );
};

export default TypingIndicator;
