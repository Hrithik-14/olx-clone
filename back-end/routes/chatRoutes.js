import express from "express";
import { getMessagesByUsers, sendMessage, getRecentChats } from "../controllers/chatController.js";
import { protect } from "../middleware/auth.js";


const router = express.Router();

router.post("/send",protect, sendMessage);
router.get("/messages/:senderId/:receiverId",protect, getMessagesByUsers);
router.get("/recent",protect, getRecentChats);

export default router;
