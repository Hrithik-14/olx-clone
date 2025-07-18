import express from "express";
import { getUserById, addData, getUserByIdByParam } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

//  Protected Routes
router.get("/profile", protect, getUserById);
router.put("/profile", protect, addData);
router.get("/profile/:id", protect, getUserByIdByParam);

export default router;
