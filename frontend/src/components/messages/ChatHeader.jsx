import React from "react";
import { Video, Phone } from "lucide-react";

const ChatHeader = ({ user, onAudioCall, onVideoCall, isOnline }) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <img
          // src={user?.avatar || "/user-placeholder.png"}
          src="/assets/images/image.jpg"
          alt={user?.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="font-medium text-sm text-gray-800">{"Mushahid Hussain"}</div>
          <div className="text-xs text-gray-500">
            {isOnline ? "Online" : `Last seen ${user?.lastSeen}`}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
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
