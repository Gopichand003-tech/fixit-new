
import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

/* ---------------- In-Memory OTP Store ---------------- */
// email -> { otp, expiresAt }
const otpStore = new Map();

/* ---------------- Mail Transporter ---------------- */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ---------------- Send OTP ---------------- */
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
    });

    await transporter.sendMail({
      from: `"FIXIT" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your FIXIT OTP Verification Code",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2> OTP Verification</h2>
          <p>Your OTP code is:</p>
          <h1 style="letter-spacing:4px;">${otp}</h1>
          <p>This OTP is valid for <b>5 minutes</b>.</p>
          <p>If you didn't request this, ignore this email.</p>
        </div>
      `,
    });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("❌ Send OTP Error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

/* ---------------- Verify OTP ---------------- */
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(400).json({ message: "Email & OTP required" });

  const record = otpStore.get(email);

  if (!record)
    return res.status(400).json({ message: "OTP not found" });

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ message: "OTP expired" });
  }

  if (record.otp !== otp)
    return res.status(400).json({ message: "Invalid OTP" });

  otpStore.delete(email);

  res.json({ success: true, message: "OTP verified successfully" });
});

export default router;
