import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/WishListController.js";
import {protect} from "../middleware/auth.js";

const router = express.Router();

router.post("/add", protect, addToWishlist);
router.get("/getwishlist", protect, getWishlist);
router.post("/remove", protect, removeFromWishlist);

export default router;
