import React, { useState, useEffect } from "react";
import { Video, Phone, ArrowLeft } from "lucide-react";

const ChatHeader = ({
  user,
  onAudioCall,
  onVideoCall,
  isOnline,
  handleBack,
}) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobileOrTablet = screenWidth < 1024;

  return (
   <div className="flex items-center justify-between pl-1 pr-3 py-2 border-b border-gray-200 bg-white sticky top-0 z-10">

      <div className="flex items-center space-x-2">
        {isMobileOrTablet && (
          <button
            onClick={handleBack}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 shadow-md transition"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
        )}

        <img
          src="/assets/images/image.jpg"
          alt={user?.name}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="flex flex-col leading-tight">
          <span className="font-medium text-sm text-gray-800 whitespace-nowrap">
            Mushahid Hussain
          </span>
          <span className="text-xs text-gray-500 truncate max-w-[120px]">
            {isOnline ? "Online" : `Last seen ${user?.lastSeen}`}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onAudioCall}
          className="p-2 rounded-full bg-[#EDF1FC] hover:bg-[#e1e8fc] transition"
        >
          <Phone size={16} className="text-[#4C68D5]" />
        </button>
        <button
          onClick={onVideoCall}
          className="p-2 rounded-full bg-[#EDF1FC] hover:bg-[#e1e8fc] transition"
        >
          <Video size={16} className="text-[#4C68D5]" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
