const Message = require("../models/messageModel");

exports.sendMessage = async (req, res) => {
  const { senderId, receiverId, text } = req.body;
  const message = new Message({ senderId, receiverId, text });
  try {
    await message.save();
    res.status(201).json({ message: "Message sent successfully", message });
  } catch (error) {
    console.error("Error sending message:", error.message);
    res
      .status(500)
      .json({ message: "An error occurred while sending the message" });
  }
};
////////////////////////////////////////////////////////////////////////////////////////?
exports.getMsgsBtwnUsers = async (req, res) => {
  const { user1Id, user2Id } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id },
      ],
    });
    res
      .status(200)
      .json({ message: "Messages fetched successfully", messages });
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res
      .status(500)
      .json({ message: "An error occurred while fetching messages" });
  }
};
////////////////////////////////////////////////////////////////////////////////////////?
