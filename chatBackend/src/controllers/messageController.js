const Message = require("../models/messageModel");

exports.getMsgsBtwnUsers = async (req, res) => {
  const { user1Id: senderId, user2Id: receiverId } = req.params;

  try {
    // Fetch received messages (where the current user is the receiver)
    let receivedMessages = await Message.find({
      senderId: receiverId,
      receiverId: senderId,
    })
      .sort({ timestamp: 1 }) // Sort by timestamp ascending
      .select("senderId receiverId text seen timestamp"); // Select only necessary fields

    // Mark received messages as "seen" and update them in the database
    const receivedMessageIds = receivedMessages.map((msg) => msg._id);
    if (receivedMessageIds.length > 0) {
      await Message.updateMany(
        { _id: { $in: receivedMessageIds } },
        { $set: { seen: true } }
      );
    }

    // Fetch sent messages (where the current user is the sender)
    let sentMessages = await Message.find({
      senderId: senderId,
      receiverId: receiverId,
    })
      .sort({ timestamp: 1 }) // Sort by timestamp ascending
      .select("senderId receiverId text seen timestamp"); // Select only necessary fields

    // Delete sent messages that have been seen
    const seenSentMessageIds = sentMessages
      .filter((msg) => msg.seen)
      .map((msg) => msg._id);
    if (seenSentMessageIds.length > 0) {
      await Message.deleteMany({ _id: { $in: seenSentMessageIds } });
    }

    // Return the fetched messages
    return res.status(200).json({
      message: "Messages fetched successfully",
      messages: {
        receivedMessages: receivedMessages.map((msg) => ({
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          message: msg.text,
          seen: msg.seen,
          timestamp: msg.timestamp,
        })),
        sentMessages: sentMessages.map((msg) => ({
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          message: msg.text,
          seen: msg.seen,
          timestamp: msg.timestamp,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({
      message: "An error occurred while fetching messages",
    });
  }
};
