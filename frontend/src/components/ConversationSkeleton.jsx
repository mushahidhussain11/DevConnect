import React from "react";

const ConversationSkeleton = () => {
  return (
    <div className="flex items-center gap-3 px-2 py-2 animate-pulse">
      {/* Avatar Skeleton */}
      <div className="w-10 h-10 rounded-full bg-gray-200"></div>

      {/* Text Skeleton */}
      <div className="flex flex-col flex-grow">
        <div className="w-3/4 h-4 bg-gray-200 rounded mb-1"></div>
        <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default ConversationSkeleton;
