

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    otp: { type: String, unique: true }, // for email login
    isVerified: { type: Boolean, default: false },
    loginType: { type: String, enum: ["google", "email"], required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    name: { type: String },         //  editable name
    phone: { type: String },        //  editable phone
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
