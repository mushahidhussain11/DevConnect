import React, { useState, useEffect } from "react";
import { Video, Phone, ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import {getLastSeen} from "../../utils/TimeHandler"
import { formatDistanceToNow } from "date-fns";

const ChatHeaderForAI = ({
 
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
          src="/assets/images/brandLogo.png"
          alt="Brand Logo"
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="flex flex-col leading-tight">
          <span className="font-medium text-sm text-gray-800 whitespace-nowrap">
            DevConnect AI
          </span>
          <span className="text-xs text-gray-500  max-w-[150px]">
            Chat with DevConnect AI
          </span>
        </div>
      </div>

    </div>
  );
};

export default ChatHeaderForAI;
