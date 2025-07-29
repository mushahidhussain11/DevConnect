import { handleCallUser } from "./callHandling";
import { getSocket } from "../../lib/socket";
export const startCall = async (type, remoteUserId,name,profile) => {
  const socket = getSocket();
  const constraints = {
    audio: true,
    video: type === "video",
  };

  const localStream = await navigator.mediaDevices.getUserMedia(constraints);
  // display local video if needed
  // then initiate the signaling process with socket.emit
  handleCallUser(socket, remoteUserId, localStream, type,name,profile);
};
