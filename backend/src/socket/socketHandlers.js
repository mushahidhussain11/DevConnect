const onlineUsers = new Map();
import { sendMessage } from "../controllers/message.controller.js";
import { updateUserLastSeenOnlineStatusAndSocketId } from "../utils/socketUtils.js";
import CallLog from "../models/call_log.model.js";

export async function socketHandlers(socket, io) {
  

  const userId = socket.handshake.query.userId;

  if (userId) {
    onlineUsers.set(userId, socket.id);
    console.log(`🟢 User connected: ${userId} -> ${socket.id}`);
  }

  console.log(onlineUsers)


  // 📥 User created (after signup/login/oauth)
  socket.on("user-created", (userData) => {
    console.log("🆕 User created:", userData);
  });

    socket.on("typing", ({ to, conversationId }) => {
    const receiverSocketId = onlineUsers.get(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("user-typing",{
      conversationId,
});
    }
  });

  socket.on("stop-typing", ({ to,conversationId }) => {
    const receiverSocketId = onlineUsers.get(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("user-stop-typing",{
      conversationId,
});
    }
  });

  // 💬 Send message handler
  socket.on("send-message", async (messageData) => {
    console.log("📨 Message sent:", messageData);

    try {
      console.log(messageData)
      const savedMessage = await sendMessage(messageData?.senderId, messageData?.receiverId, messageData?.text);
      const conversationId = messageData?.conversationId;

      // Send back to sender (confirmation)
      socket.emit("message-sent", savedMessage);

      // Send to receiver (only if online)
      const receiverSocketId = onlineUsers.get(messageData?.receiverId);
      if (receiverSocketId) {
        console.log("Message goes live")
        io.to(receiverSocketId).emit("receive-message", {savedMessage,conversationId});
      } else {
        console.log("❌ Receiver not online:", messageData.receiverId);
      }
    } catch (err) {

      console.error("❌ Error saving message:", err.message);
      socket.emit("error", "Message failed to send");

    }
  });

    // Handle call initiation
  socket.on("call-user", ({ to, offer,type,name,profile }) => {
    console.log("to"  ,to)
    const targetSocketId = onlineUsers.get(to);
    if (targetSocketId) {
      io.to(targetSocketId).emit("incoming-call", { from: socket.id, offer,type,name,profile });
      console.log(`📞 Call offer sent from ${socket.id} to ${targetSocketId}`);
    }
  });

  // Handle call answering
  socket.on("answer-call", ({ to, answer }) => {
    io.to(to).emit("call-answered", { answer });
    console.log(`✅ Call answered, relayed to ${to}`);
  });

  // Handle ICE candidate exchange
  socket.on("ice-candidate", ({ to, candidate }) => {
    io.to(to).emit("ice-candidate", { candidate });
    console.log(`❄️ ICE candidate sent to ${to}`);
  });

  // Optional: Call end handler
  socket.on('end-call', async ({ from, to, callType, status }) => {
    try {
      // Save call log to DB
      await CallLog.create({ from, to, callType, status });

      // Notify the other user
      socket.to(to).emit('call-ended-log', {
        from,
        callType,
        status,
      });
    } catch (error) {
      console.error('Error saving call log:', error);
    }
  });

  socket.on("reject-call", ({ to }) => {
    io.to(to).emit("call-rejected");
    console.log(`🚫 Call rejected, relayed to ${to}`);
  })

  socket.on("disconnect", () => {

    const userId = socket.handshake.query.userId;

    updateUserLastSeenOnlineStatusAndSocketId(null,userId)
  
    console.log("🔴 Disconnected:", socket.id);
    // Remove from onlineUsers map
    onlineUsers.forEach((sid, uid) => {
      if (sid === socket.id) onlineUsers.delete(uid);
    });
  });

  
}
