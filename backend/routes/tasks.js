// backend/routes/tasks.js
import express from "express";
import { sendWhatsapp } from "../utils/sendWhatsapp.js";

const router = express.Router();

// POST /api/tasks/send-whatsapp
router.post("/send-whatsapp", async (req, res) => {
  try {
    const { workerNumber, taskMessage } = req.body;

    // Validate inputs
    if (!workerNumber?.trim() || !taskMessage?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Missing or empty workerNumber or taskMessage",
      });
    }

    // Send WhatsApp message
    await sendWhatsapp(workerNumber, taskMessage);

    res.status(200).json({
      success: true,
      message: "✅ WhatsApp message sent successfully!",
    });
  } catch (error) {
    console.error("🚨 WhatsApp Error:", error);
    res.status(500).json({
      success: false,
      message: "❌ Failed to send WhatsApp message",
      error: error.message || error,
    });
  }
});

export default router;
