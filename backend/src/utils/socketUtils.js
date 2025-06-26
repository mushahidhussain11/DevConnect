import User from "../models/user.model.js";
export async function updateUserLastSeenOnlineStatusAndSocketId(socketId, userId) {
  try {
    const update = socketId
      ? { onlineStatus: true, socketId } // 🔁 Ensure field name matches your schema
      : { onlineStatus: false, socketId: null, lastSeen: new Date() };

    await User.findByIdAndUpdate(userId, update);
  } catch (err) {
    console.error("Failed to update user status:", err.message);
  }
}