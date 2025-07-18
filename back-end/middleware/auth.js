import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../model/User.js';

dotenv.config();

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for Bearer token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    console.log(token);
    

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID (from decoded token payload)
    const user = await User.findById(decoded.id).select('-otp');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

