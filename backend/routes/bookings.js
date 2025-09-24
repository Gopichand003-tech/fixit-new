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
      workerPhone: workerPhone.trim(),
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
    console.log("📦 Booking saved:", booking._id);


    const msg = `🔔 New Booking Request
Issue: ${booking.issue}
Price: ₹${booking.price}
User: ${booking.userName} (${booking.userPhone})
Address: ${booking.userAddress}
Time Slot: ${booking.timeSlot}

Please contact the user to confirm.`;

    // ✅ Sanitize worker phone to strict E.164 format
let cleanPhone = workerPhone.replace(/\D/g, ""); // remove everything except digits
if (!cleanPhone.startsWith("91")) cleanPhone = "91" + cleanPhone; // prepend country code if missing
cleanPhone = "+" + cleanPhone;

let whatsappStatus = "success";
let whatsappError = null;

if (/^\+\d{10,15}$/.test(cleanPhone)) {
  try {
    await sendWhatsapp(cleanPhone, msg);
    console.log(`✅ WhatsApp sent to worker ${cleanPhone}`);
  } catch (err) {
    console.error("❌ Worker WhatsApp failed:", err);
    whatsappStatus = "failed";
    whatsappError = err.message || err;
  }
} else {
  console.warn("❌ Skipping WhatsApp: invalid workerPhone", cleanPhone);
  whatsappStatus = "failed";
  whatsappError = "Invalid worker phone number";
}

res.status(201).json({
  message: "Booking created",
  booking,
  whatsappStatus,
  whatsappError,
});

  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: "Failed to save booking" });
  }
});

// GET /api/bookings → fetch bookings only for logged-in user, exclude cancelled
router.get("/", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.user._id,
      status: { $ne: "user-cancelled" }, // exclude cancelled
    }).sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (err) {
    console.error("Fetch bookings error:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// PATCH /api/bookings/:id/cancel
router.patch("/:id/cancel", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Not authorized to cancel this booking" });

    // Update booking status first
    booking.status = "user-cancelled";
    await booking.save();

    // WhatsApp notification
    let whatsappStatus = "success";
    let whatsappError = null;

    const msg = `❌ Booking Cancelled by User
Issue: ${booking.issue}
User: ${booking.userName} (${booking.userPhone})
Time Slot: ${booking.timeSlot}`;

    try {
      // Sanitize worker phone to strict E.164 format
      let cleanPhone = booking.workerPhone.replace(/\D/g, "");
      if (!cleanPhone.startsWith("91")) cleanPhone = "91" + cleanPhone;
      cleanPhone = "+" + cleanPhone;

      if (/^\+\d{10,15}$/.test(cleanPhone)) {
        await sendWhatsapp(cleanPhone, msg);
        console.log(`✅ WhatsApp sent to worker ${cleanPhone} about cancellation`);
      } else {
        whatsappStatus = "failed";
        whatsappError = "Invalid worker phone number";
        console.warn("❌ Skipping WhatsApp: invalid workerPhone", cleanPhone);
      }
    } catch (err) {
      whatsappStatus = "failed";
      whatsappError = err.message || err;
      console.warn("❌ WhatsApp sending failed, but booking cancelled:", err);
    }

    // Always respond with booking cancelled info
    res.json({
      message: "Booking cancelled successfully",
      booking,
      whatsappStatus,
      whatsappError,
    });
  } catch (err) {
    console.error("Cancel booking error:", err);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});


export default router;
