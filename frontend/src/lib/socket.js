
import { io } from "socket.io-client";

// 🔁 Use environment variable or fallback
const  SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

let socket = null;

export const createSocket = (userId) => {
  return socket = io(SOCKET_URL, {
    autoConnect: true,
    transports: ["websocket"],
    query: { userId }, // ✅ attach userId here
  });
};

export const getSocket = () => socket;
