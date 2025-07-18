

import express from "express";

import {protect} from "../middleware/auth.js";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/getcart", protect, getCart);
router.post("/remove", protect, removeFromCart);

export default router;
