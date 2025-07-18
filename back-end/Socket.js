import { Server } from "socket.io";

let io;

export const setupSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`✅ Socket connected: ${socket.id}`);

    // Join a room based on sender and receiver IDs to ensure private messaging
    socket.on("join_chat", ({ senderId, receiverId }) => {
      const roomId = [senderId, receiverId].sort().join("_"); // Unique room ID (e.g., "user1_user2")
      socket.join(roomId);
      console.log(`🚪 User ${socket.id} joined chat ${roomId}`);
    });

    // Handle sending a message
    socket.on("send_message", (data) => {
      const { sender, receiver, message } = data;
      if (!sender || !receiver || !message) {
        console.error("Invalid message data:", data);
        return;
      }

      const roomId = [sender, receiver].sort().join("_");
      io.to(roomId).emit("receive_message", {
        sender,
        receiver,
        message,
        timestamp: Date.now(),
      });
      console.log(`📨 Message sent to room ${roomId}:`, data);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Disconnected: ${socket.id}`);
    });
  });
};

export { io };