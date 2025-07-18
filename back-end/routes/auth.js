import express from "express";
import {
  requestOTP,
  verifyOTP,
  googleLogin, 
  
  Logout,

} from "../controllers/auth.js";
import { protect } from "../middleware/auth.js";


const router = express.Router();

router.post("/send-otp", requestOTP);
router.post("/verify-otp", verifyOTP);
router.post("/google-login", googleLogin);
router.post("/logout", Logout);

// router.get("/profile", protect, getUserById);
// router.put("/profile", protect, addData);




export default router;


