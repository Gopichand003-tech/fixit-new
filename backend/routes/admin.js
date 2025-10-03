import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Admin from "../models/admin.js"; // Mongoose model

const router = express.Router();

// In-memory OTP store (replace with DB in production)
const otpStore = {}; // { email: { otp: "123456", expires: Date } }

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Utility: Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Middleware: Verify JWT
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// 1️⃣ Admin login → check credentials + send OTP + tempToken
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    // Generate OTP
    const otp = generateOTP();
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "FixIt Admin OTP",
      text: `Your OTP for FixIt Admin login is: ${otp}. It expires in 5 minutes.`,
    });

    // Generate short-lived temp token for frontend
    const tempToken = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    res.json({ message: "OTP sent to your email", tempToken });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//Security check
router.post("/security-check", (req, res) => {
  const { tempToken, key } = req.body || {};
  if (!tempToken || !key) {
    return res.status(400).json({ message: "Missing temp token or OTP" });
  }

  try {
    const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    const record = otpStore[decoded.email];

    if (!record) return res.status(400).json({ message: "OTP not requested" });
    if (record.expires < Date.now()) {
      delete otpStore[decoded.email];
      return res.status(400).json({ message: "OTP expired" });
    }
    if (record.otp !== key) return res.status(400).json({ message: "Invalid OTP" });

   
    // ✅ After verifying OTP
// After verifying OTP
const token = jwt.sign(
  { email: decoded.email, role: "admin" },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);

// Use different settings for dev vs production
const isProduction = process.env.NODE_ENV === "production";

res.cookie("adminToken", token, {
  httpOnly: true,           // JS cannot read it
  secure: isProduction,     // HTTPS only in prod
  sameSite: isProduction ? "strict" : "lax", // allow localhost cross-port
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

res.json({ success: true, message: "Admin verified" });

  } catch (err) {
    console.error("Security check error:", err);
    res.status(401).json({ message: "Invalid or expired temp token" });
  }
});

// backend route
router.get("/check-auth", (req, res) => {
  console.log("Cookies received:", req.cookies);

  const token = req.cookies?.adminToken;
  if (!token) return res.json({ authenticated: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    res.json({ authenticated: true, admin: decoded });
  } catch (err) {
    console.error("JWT verify error:", err);
    res.json({ authenticated: false });
  }

});




// 3️⃣ Protected route → dashboard example
router.get("/adminDashboard", verifyToken, (req, res) => {
  res.json({ message: "Welcome to admin dashboard", admin: req.admin });
});

export default router;
