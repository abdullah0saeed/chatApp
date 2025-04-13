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

        io.to(receiverId).emit("receiveMessage", {
          senderId,
          message,
          seen,
          timestamp,
        });
        console.log(`Message sent from ${senderId} to ${receiverId}`);
      }
    );

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`Socket ${socket.id} disconnected`);
    });
  });
};
