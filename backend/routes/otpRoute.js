import express from "express";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Temporary in-memory OTP store
const otpStore = {};

// Format phone to E.164 (default +91)
const formatPhone = (phone, countryCode = "+91") => {
  return phone.startsWith("+") ? phone : `${countryCode}${phone}`;
};

// ✅ Send OTP
router.post("/send-otp", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone is required" });

    // Use let, since we are storing it later
    let otp = Math.floor(100000 + Math.random() * 900000);

    const formattedPhone = formatPhone(phone);

    // Save OTP with expiry
    otpStore[formattedPhone] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 min
    };

    // Send SMS
    await client.messages.create({
      body: `This is from  FIXIT Service and Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log("OTP sent:", otp);
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error sending OTP:", err.message);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// ✅ Verify OTP
router.post("/verify-otp", (req, res) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ message: "Phone and OTP required" });

    const formattedPhone = formatPhone(phone);
    const stored = otpStore[formattedPhone];

    if (!stored) return res.status(400).json({ message: "OTP not found" });
    if (stored.expiresAt < Date.now()) return res.status(400).json({ message: "OTP expired" });
    if (stored.otp != otp) return res.status(400).json({ message: "Invalid OTP" });

    delete otpStore[formattedPhone]; // remove after verification

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (err) {
    console.error("Error verifying OTP:", err.message);
    res.status(500).json({ message: "Failed to verify OTP" });
  }
});

export default router;
