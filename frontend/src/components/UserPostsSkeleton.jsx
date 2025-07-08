import React from "react";
import "../shimmer.css"; // 👈 for shimmer animation

const UserPostsSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto mt-6 px-4">
      <div className="w-full max-w-3xl mt-6 px-4 mx-auto bg-white rounded-xl shadow overflow-hidden p-4 space-y-4">
        {/* Header: Avatar + Info */}
        <div className="flex items-center space-x-4">
          <div className="skeleton-circle w-12 h-12" />
          <div className="flex-1 space-y-2">
            <div className="skeleton-line w-32 h-4" />
            <div className="skeleton-line w-20 h-3" />
          </div>
        </div>

        {/* Text lines */}
        <div className="space-y-2">
          <div className="skeleton-line w-full h-3" />
          <div className="skeleton-line w-5/6 h-3" />
          <div className="skeleton-line w-4/6 h-3" />
        </div>

        {/* Image */}
        <div className="skeleton-rect h-52 w-full rounded-lg" />
      </div>
    </div>
  );
};

export default UserPostsSkeleton;
