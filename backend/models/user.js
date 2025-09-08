import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // optional for Google users
    googleId: { type: String, unique: true, sparse: true },
    profilePic: { type: String, default: null }, // optional profile picture

    // 🔹 OTP fields for password reset
    resetOtp: { type: String },
    resetOtpExpiry: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
