import {Server} from "socket.io";
import { socketHandlers } from "./socketHandlers.js";
import { updateUserLastSeenOnlineStatusAndSocketId } from "../utils/socketUtils.js";

export async function initializeSocket(server) {
  try {

    const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    
    const userId = socket.handshake.query.userId;
    console.log("Socket connected:", socket.id);
    console.log("User ID:", userId);

    // Register all event handlers
    updateUserLastSeenOnlineStatusAndSocketId(socket?.id,userId)
    socketHandlers(socket, io);

  
  });


  } catch(error) {

     console.error("❌ Failed to initialize Socket.IO:", serverError.message);
    throw serverError; // Optional: allow top-level caller to handle it

  }
}




