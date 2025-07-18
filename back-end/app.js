import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http"; 
import connectDB from "./config/db.js";
import { setupSocket } from "./Socket.js";

// Routes
import authRoutes from "./routes/auth.js";
import listingRoutes from "./routes/listingRoutes.js";
import CartRoutes from "./routes/cartRoutes.js";
import WishListRoutes from "./routes/wishlistRoutes.js";
import UserRoutes from "./routes/userRoutes.js";
import ChatRoutes from "./routes/chatRoutes.js";

// Connect to MongoDB
connectDB();

// Express app
const app = express();

// HTTP server (needed for Socket.IO)
const server = http.createServer(app);

// Setup Socket.IO
setupSocket(server); // ✅ this attaches socket to the server

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/listings', listingRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/wishlist', WishListRoutes);
app.use('/api/cart', CartRoutes);
app.use('/api/user', UserRoutes);
app.use("/api/chat", ChatRoutes);

// Fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: "API endpoint not found" });
});
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ success: false, message: "Server error" });
});

// Start server
const PORT = process.env.PORT || 9999;
server.listen(PORT, () => {
  console.log(`🚀 Server with Socket.IO running on http://localhost:${PORT}`);
});

