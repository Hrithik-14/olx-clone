import User from "../model/User.js";
import { generateOTP } from "../utils/otpGenerator.js";
import { sendOTP } from "../config/nodemailer.js";
import { generateToken } from "../utils/token.js";
import dotenv from 'dotenv';
dotenv.config();

import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); 

export const requestOTP = async (req, res) => {
  try {
    const { email, role } = req.body;
    const otp = generateOTP();

    let user = await User.findOne({ email });

    if (user) {
      user.otp = otp;
      user.loginType = "email";
      if (!user.role && role) {
        user.role = role;
      }
    } else {
      user = new User({
        email,
        otp,
        loginType: "email",
        role: role || "user",
      });
    }

    await user.save();
    await sendOTP(email, otp);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};


export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
console.log(req.body)

    const user = await User.findOne({ email });
    console.log(user.otp,otp)
    console.log(user)
    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    // user.otp = null;
    await user.save();

    const token = generateToken(user,res);
console.log(token)


    res.status(200).json({
      message: "OTP verified",
      user
    });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed", error: error.message });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { token, role } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        loginType: "google",
        isVerified: true,
        role: role || "user", //  set role
      });
    } else if (!user.role && role) {
      user.role = role; //  update role if missing
    }

    await user.save();

    const jwtToken = generateToken(user._id,res);
    console.log("tokrn",jwtToken);
    
    // Set cookies for authentication
    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.cookie('user', JSON.stringify({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name || user.email.split('@')[0] // fallback name
    }), {
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(200).json({
      message: "Google login successful",
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    
    res.status(400).json({ message: "Google login failed", error: error.message });
  }
};



export const Logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.clearCookie("refreshtoken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.clearCookie("user", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({ status: "success", message: "Logout successful" });
};

