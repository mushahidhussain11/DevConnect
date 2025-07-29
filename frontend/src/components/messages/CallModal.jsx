import React from "react";
import {
  PhoneIncoming,
  PhoneMissed,
  PhoneOff,
  Video,
  Phone,
} from "lucide-react";
import { startCall } from "./startCall";

const CallModal = ({
  isOpen,
  type, // "audio" or "video"
  mode, // "incoming" or "outgoing"
  user,
  onAccept,
  onReject,
  onCancel,
}) => {
  if (!isOpen) return null;

  const isVideo = type === "Video";
  const isIncoming = mode === "incoming";

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg bg-opacity-95 flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 md:p-10 text-center border border-gray-300 flex flex-col items-center justify-center animate-fade-in">
        {/* Avatar with ring effect */}
        <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-full overflow-hidden ring-4 ring-primary shadow-lg mb-6">
          <img
            src={user.pic}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name & Status */}
        <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
        {/* <p className="text-lg text-gray-500 mt-2 tracking-wide">
          {isIncoming ? `is calling you...` : `Calling via ${type}...`}
        </p> */}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 w-full">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full shadow-xl text-lg font-semibold transition transform hover:scale-105"
          >
            <PhoneOff className="w-6 h-6" />
            Cancel Call
          </button>
        </div>

        {/* Call Type Label */}
        <div className="mt-6 text-gray-400 text-sm flex items-center gap-2 justify-center">
          {isVideo ? (
            <Video className="w-5 h-5" />
          ) : (
            <Phone className="w-5 h-5" />
          )}
          {isVideo ? "Video Call" : "Audio Call"}
        </div>
      </div>
    </div>
  );
};

export default CallModal;
