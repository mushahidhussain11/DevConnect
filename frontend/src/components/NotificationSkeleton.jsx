import React from "react";

const NotificationSkeleton = () => {
  return (
    <div className="relative flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 animate-pulse">
      {/* Delete button placeholder */}
      <div className="absolute top-3 right-3 w-4 h-4 bg-gray-200 rounded" />

      {/* Avatar Skeleton */}
      <div className="w-12 h-12 rounded-full bg-gray-200" />

      {/* Content Skeleton */}
      <div className="flex-1 space-y-2">
        {/* Icon + Line */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
        {/* Time */}
        <div className="h-3 w-20 bg-gray-200 rounded mt-2" />
      </div>
    </div>
  );
};

export default NotificationSkeleton;
