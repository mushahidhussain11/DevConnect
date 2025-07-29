import React from "react";
import {
  PhoneIncoming,
  PhoneMissed,
  Video,
  Phone,
} from "lucide-react";
import { useSocket } from "../../hooks/SocketContext";

const IncomingCallModal = () => {
  const {
    incomingCall,
    setIncomingCall,
    socket,
    peerConnection,
    localStream,
  } = useSocket();

    console.log("Working ",incomingCall)

  if (!incomingCall) return null;



  const { from, callType,name,profile } = incomingCall;
  const isVideo = callType === "video";

  const handleAccept = async () => {
    try {
      // Step 1: Get local media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideo,
        audio: true,
      });

      // Step 2: Attach to state
      localStream.current = stream;
      stream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, stream);
      });

      // Step 3: Create and send answer
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit("answer-call", {
        to: from._id,
        answer,
      });

      // Optional: Show call UI, hide modal
      setIncomingCall(null);
    } catch (error) {
      console.error("Error accepting call:", error);
    }
  };

  const handleReject = () => {
    socket.emit("reject-call", { to: from._id });
    setIncomingCall(null);
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-opacity-60 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center animate-fade-in">
        {/* Avatar */}
        <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden ring-4 ring-blue-500 mb-4">
          <img
            src={profile}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Caller Name */}
        <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
        <p className="text-gray-500 mt-2 text-lg">is calling you...</p>

        {/* Call Type */}
        <div className="mt-3 text-gray-400 text-sm flex items-center gap-2 justify-center">
          {isVideo ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
          {isVideo ? "Video Call" : "Audio Call"}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex items-center justify-center gap-6">
          <button
            onClick={handleAccept}
            className="bg-green-500 hover:bg-green-600 text-white p-5 rounded-full shadow-lg transition-transform hover:scale-110"
            title="Accept"
          >
            <PhoneIncoming className="w-6 h-6" />
          </button>
          <button
            onClick={handleReject}
            className="bg-red-500 hover:bg-red-600 text-white p-5 rounded-full shadow-lg transition-transform hover:scale-110"
            title="Reject"
          >
            <PhoneMissed className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
