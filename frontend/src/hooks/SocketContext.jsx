// context/SocketContext.js
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { getSocket } from "../lib/socket";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {

  console.log("socket provider");
  const socket = useRef(null);
  const peerConnection = useRef(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);

  useEffect(() => {

    socket.current = getSocket();

    if (!socket.current) {
      console.warn("Socket not initialized.");
      return;
    }

    // Incoming call setup (no answer here)
    socket.current.on("incoming-call", async ({ from, offer, type,name,profile }) => {

      console.log("incomming call")
      setIncomingCall({ from, callType: type, offer,name,profile });
    });

    socket.current.on("ice-candidate", ({ candidate }) => {
      if (peerConnection.current && candidate) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });



     socket.current.on("call-answered", async ({ answer }) => {
    try {
      if (!peerConnection.current) return;

      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    } catch (err) {
      console.error("Failed to handle call-answered:", err);
    }
  });

  // ✅ New listener: call rejected
  socket.current.on("call-rejected", () => {
    alert("Call was rejected by the recipient.");
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
  });



    return () => {
      socket.current?.disconnect();
    };
  }, []);



  const answerCall = async () => {
    try {
      const { from, offer, callType } = incomingCall;

      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      // Local stream
      const local = await navigator.mediaDevices.getUserMedia({
        video: callType === "video",
        audio: true,
      });
      setLocalStream(local);
      local.getTracks().forEach((track) =>
        peerConnection.current.addTrack(track, local)
      );

      // Remote stream
      const remote = new MediaStream();
      setRemoteStream(remote);
      peerConnection.current.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) =>
          remote.addTrack(track)
        );
      };

      // ICE
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.current.emit("ice-candidate", {
            to: from._id,
            candidate: event.candidate,
          });
        }
      };

      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      socket.current.emit("answer-call", {
        to: from._id,
        answer,
      });

      setIncomingCall(null);
    } catch (err) {
      console.error("Failed to answer call:", err);
    }
  };



  const rejectCall = () => {
    if (incomingCall?.from) {
      socket.current.emit("reject-call", { to: incomingCall.from._id });
    }
    setIncomingCall(null);
  };



  return (
    <SocketContext.Provider
      value={{
        socket: socket.current,
        incomingCall,
        setIncomingCall,
        answerCall,
        rejectCall,
        peerConnection,
        remoteStream,
        localStream,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
