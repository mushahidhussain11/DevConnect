import React from 'react';
import "../shimmer.css" // 👈 for shimmer animation

const PostsSkeleton = () => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow overflow-hidden p-4 space-y-4">
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
  );
};

export default PostsSkeleton;
