import React from 'react'

const UserInfoLoadingSkeleton = () => {
  return (
   <div className="max-w-3xl mx-auto mt-0 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 animate-pulse">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Left: Profile Info */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <div className="h-5 w-40 bg-gray-200 rounded"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
              <div className="h-3 w-32 bg-gray-200 rounded mt-1"></div>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto text-center mt-4 md:mt-0">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx}>
                <div className="h-6 w-10 mx-auto bg-gray-200 rounded mb-1"></div>
                <div className="h-3 w-16 mx-auto bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-gray-200" />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-start sm:gap-3 gap-2 items-center sm:items-start">
          <div className="flex gap-2 sm:gap-3">
            <div className="h-9 w-24 sm:w-28 bg-gray-200 rounded-full"></div>
            <div className="h-9 w-24 sm:w-28 bg-gray-200 rounded-full"></div>
          </div>
          <div className="mt-2 sm:mt-0">
            <div className="h-9 w-24 sm:w-28 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfoLoadingSkeleton