// backend/routes/tasks.js
import express from "express";
import { sendWhatsapp } from "../utils/sendWhatsapp.js";

const router = express.Router();

router.post("/send-whatsapp", async (req, res) => {
  try {
    const { workerNumber, taskMessage } = req.body;
    if (!workerNumber || !taskMessage) {
      return res.status(400).json({ message: "Missing workerNumber or taskMessage" });
    }
    await sendWhatsapp(workerNumber, taskMessage);
    res.status(200).json({ message: "WhatsApp message sent successfully!" });
  } catch (err) {
    console.error("WhatsApp Error:", err);
    res.status(500).json({ message: "Failed to send WhatsApp message" });
  }
});

export default router;
