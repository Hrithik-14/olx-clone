import Chat from "../model/Chat.js";
import mongoose from "mongoose";

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    if (!sender || !receiver || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Validate ObjectIds
    if (!mongoose.isValidObjectId(sender) || !mongoose.isValidObjectId(receiver)) {
      return res.status(400).json({ success: false, message: "Invalid sender or receiver ID" });
    }

    const newMessage = new Chat({ sender, receiver, message });
    await newMessage.save();

    res.status(201).json({ success: true, data: newMessage });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// Get all messages between two users
export const getMessagesByUsers = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    if (!mongoose.isValidObjectId(senderId) || !mongoose.isValidObjectId(receiverId)) {
      return res.status(400).json({ success: false, message: "Invalid sender or receiver ID" });
    }

    const messages = await Chat.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// Get recent chats for a user
export const getRecentChats = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const recentMessages = await Chat.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { receiver: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", new mongoose.Types.ObjectId(userId)] },
              "$receiver",
              "$sender",
            ],
          },
          lastMessage: { $first: "$message" },
          timestamp: { $first: "$timestamp" },
        },
      },
      {
        $project: {
          userId: "$_id",
          lastMessage: 1,
          timestamp: 1,
          _id: 0,
        },
      },
      {
        $sort: { timestamp: -1 },
      },
    ]);

    res.status(200).json({ success: true, data: recentMessages });
  } catch (err) {
    console.error("Failed to fetch recent chats:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};