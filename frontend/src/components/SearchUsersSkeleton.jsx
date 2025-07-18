import React from "react";

export default function SearchUsersSkeleton() {
  return (
    <div className="w-3xl space-y-4 bg-white relative ml-4 sm:p-5 md:p-6 rounded-xl shadow-md">
      {Array(6).fill(0).map((_, index) => (
        <div
          key={index}
          className="flex flex-col sm:flex-row sm:items-center justify-between 
                     p-3 sm:p-4 md:p-5 bg-white rounded-xl animate-pulse"
        >
          {/* Avatar + Name & Role */}
          <div className="flex items-center gap-3 sm:gap-4 w-full">
            {/* Avatar */}
            <div className="w-14 h-14 bg-gray-300 rounded-full" />
            {/* Name & Role */}
            <div className="flex flex-col justify-center space-y-2 w-full">
              <div className="h-4 bg-gray-300 rounded w-3/5 sm:w-2/5" />
              <div className="h-3 bg-gray-200 rounded w-2/5 sm:w-1/4" />
            </div>
          </div>

          {/* Follow button skeleton */}
          <div className="mt-3 sm:mt-0 sm:ml-4 h-9 w-full sm:w-24 bg-gray-300 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
