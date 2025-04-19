const Message = require("../models/messageModel");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`Socket ${socket.id} connected`);

    // Join user to a personal room
    socket.on("join", (userId) => {
      if (!userId) {
        console.warn("Invalid userId provided for join event");
        return;
      }
      socket.join(userId);
      console.log(`Socket ${socket.id} joined room ${userId}`);
    });

    // Send message to a specific receiver
    socket.on(
      "sendMessage",
      ({ senderId, receiverId, message, seen, timestamp }) => {
        if (!senderId || !receiverId || !message) {
          console.warn("Invalid data provided for sendMessage event");
          return;
        }

        const utcTimestamp = timestamp ? new Date(timestamp) : new Date();

        Message.create({
          senderId,
          receiverId,
          text: message,
          seen,
          timestamp: utcTimestamp,
        });

        io.to(receiverId).emit("receiveMessage", {
          senderId,
          receiverId,
          message,
          seen,
          timestamp: utcTimestamp,
        });
        console.log(`Message sent from ${senderId} to ${receiverId}`);
      }
    );

    // Handle message seen acknowledgment
    socket.on("messageSeen", async ({ senderId, receiverId, messageId }) => {
      console.log(messageId);

      try {
        const result = await Message.deleteOne({
          timestamp: new Date(messageId),
          senderId,
          receiverId,
        });
        console.log("result", result);

        if (result.deletedCount > 0) {
          io.to(senderId).emit("updateMessageSeen", messageId);
        }
      } catch (err) {
        console.error("Error deleting message:", err);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Socket ${socket.id} disconnected`);
    });
  });
};
