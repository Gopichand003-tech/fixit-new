import express from "express";
import Booking from "../models/booking.js";
import protect from "../Middleware/authMiddleware.js";
import { sendWhatsapp } from "../utils/sendWhatsapp.js";
import crypto from "crypto";

const router = express.Router();

// ✅ Protect all booking routes
router.use(protect);

/**
 * POST /api/bookings
 * User creates a booking → WhatsApp request is sent to the worker
 */
router.post("/", async (req, res) => {
  try {
    const {
      workerId,
      workerName,
      workerPhone,
      issue,
      price,
      userName,
      userPhone,
      userAddress,
      timeSlot,
    } = req.body;

    // Basic validation
    if (
      !workerId || !workerName || !workerPhone ||
      !issue || !price || !userName || !userPhone ||
      !userAddress || !timeSlot
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const booking = new Booking({
      workerId,
      workerName,
      workerPhone,
      issue,
      price,
      userId: req.user._id,
      userName,
      userPhone,
      userAddress,
      timeSlot,
      status: "request-sent",
      confirmationCode: crypto.randomBytes(6).toString("hex"),
      requestSentAt: new Date(),
    });
    await booking.save();

    // ✅ Build Twilio interactive button payload
    const interactiveButtons = {
      type: "button",
      body: {
        text: `🔔 New Booking Request
Issue: ${booking.issue}
Price: ₹${booking.price}
User: ${booking.userName} (${booking.userPhone})
Address: ${booking.userAddress}
Time Slot: ${booking.timeSlot}

Please confirm:`.trim(),
      },
      action: {
        buttons: [
          { type: "reply", reply: { id: `accept_${booking._id}`, title: "✅ Accept" } },
          { type: "reply", reply: { id: `reject_${booking._id}`, title: "❌ Reject" } },
        ],
      },
    };

    // ✅ Send interactive WhatsApp to worker
    try {
      await sendWhatsapp(workerPhone, null, interactiveButtons);
      console.log("✅ Interactive WhatsApp sent to worker");
    } catch (err) {
      console.error("❌ Worker WhatsApp failed:", err);
    }

    res.status(201).json({
      message: "Booking created & request sent to worker",
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: "Failed to save booking" });
  }
});

/**
 * POST /api/bookings/whatsapp-reply
 * Webhook endpoint for Twilio button replies
 */
router.post(
  "/whatsapp-reply",
  express.urlencoded({ extended: false }),
  async (req, res) => {
    try {
      const { WaId, ButtonId } = req.body; // Twilio webhook fields
      console.log("Incoming WhatsApp reply:", req.body);

      const booking = await Booking.findOne({ workerPhone: WaId });
      if (!booking) return res.status(404).send("Booking not found");

      // Update booking status based on button pressed
      if (ButtonId?.startsWith("accept_")) {
        booking.status = "worker-accepted";
      } else if (ButtonId?.startsWith("reject_")) {
        booking.status = "worker-rejected";
      } else {
        booking.status = "pending";
      }
      booking.decisionAt = new Date();
      await booking.save();

      // Notify user
      const msg =
        booking.status === "worker-accepted"
          ? `✅ Your booking for *${booking.issue}* has been accepted by ${booking.workerName}.`
          : `❌ Your booking for *${booking.issue}* was rejected by ${booking.workerName}.`;

      try {
        await sendWhatsapp(booking.userPhone, msg);
      } catch (err) {
        console.error("❌ User WhatsApp failed:", err);
      }

      // Twilio expects empty XML response
      res.type("text/xml").send("<Response></Response>");
    } catch (err) {
      console.error("WhatsApp reply error:", err);
      res.status(500).send("Server Error");
    }
  }
);

// Existing GET/PATCH routes remain unchanged
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

export default router;
