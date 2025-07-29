import React, { useState, useEffect } from "react";
import { Video, Phone, ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { getLastSeen } from "../../utils/TimeHandler";
import { formatDistanceToNow } from "date-fns";
import CallModal from "./CallModal";
import { startCall } from "./startCall";

const ChatHeader = ({
  onAudioCall,
  onVideoCall,
  isOnline,
  conversation,
  handleBack,
}) => {
  const { user } = useSelector((state) => state.auth);

  const otherUser = conversation?.members?.find(
    (member) => member._id !== user?.user?._id
  );

  const currentChatUserLastSeen = getLastSeen(otherUser?.lastSeen);
  console.log(currentChatUserLastSeen);

  const [isOpen, setIsOpen] = useState(false);
  const [isAudio, setIsAudio] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [mode, setMode] = useState("outgoing");

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onAccept = () => {


  };

  const onReject = () => {};

  const onCancel = () => {
    setIsOpen(false);
    setIsAudio(false);
    setIsVideo(false);
  };

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
          src={otherUser?.profilePic}
          alt={otherUser?.fullName}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="flex flex-col leading-tight">
          <span className="font-medium text-sm text-gray-800 whitespace-nowrap">
            {otherUser?.fullName}
          </span>
          <span className="text-xs text-gray-500  max-w-[150px]">
            {otherUser?.onlineStatus === true
              ? "Online"
              : `${currentChatUserLastSeen}`}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 relative xs:left-3">
        <button
          onClick={() => {
           
            setIsOpen(!isOpen);
            setIsAudio(true);
           startCall('audio', otherUser?._id, user?.user?.fullName, user?.user?.profilePic);
          }}
          className="p-2 rounded-full bg-[#EDF1FC] hover:bg-[#e1e8fc] transition"
        >
          <Phone size={16} className="text-[#4C68D5]" />
        </button>
        <button
          onClick={() => {
           
            setIsOpen(!isOpen);
            setIsVideo(true);
            startCall('video', otherUser?._id, user?.user?.fullName, user?.user?.profilePic);
            
          }}
          className="p-2 rounded-full bg-[#EDF1FC] hover:bg-[#e1e8fc] transition"
        >
          <Video size={16} className="text-[#4C68D5]" />
        </button>
      </div>

      <CallModal
        isOpen={isOpen}
        type={isAudio ? "Audio" : "Video"}
        mode={mode}
        user={{ name: otherUser?.fullName, pic: otherUser?.profilePic}}
        onCancel={onCancel}
        onAccept={onAccept}
        onReject={onReject}
      />
    </div>
  );
};

export default ChatHeader;
