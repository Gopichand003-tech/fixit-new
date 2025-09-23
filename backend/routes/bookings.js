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
    console.log("📦 Booking saved:", booking._id);

    // ✅ Send WhatsApp (plain text) to worker
    const msg = `🔔 New Booking Request
Issue: ${booking.issue}
Price: ₹${booking.price}
User: ${booking.userName} (${booking.userPhone})
Address: ${booking.userAddress}
Time Slot: ${booking.timeSlot}

Please contact the user to confirm.`;

    try {
      await sendWhatsapp(workerPhone, msg);
      console.log(`✅ WhatsApp sent to worker ${workerPhone}`);
    } catch (err) {
      console.error("❌ Worker WhatsApp failed:", err);
    }

    // Optional: in-app notification (can keep or remove)
    try {
      await axios.post(
        `${process.env.VITE_API_URL}/api/notifications`,
        {
          workerId: worker._id,
          message: `New booking from ${userName} for ${issue} at ${timeSlot}`,
        },
        { headers: { Authorization: `Bearer ${req.cookies.token}` } }
      );
    } catch (err) {
      console.warn("⚠️ Notification failed", err);
    }

    res.status(201).json({
      message: "Booking created & WhatsApp sent to worker",
      booking,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: "Failed to save booking" });
  }
});

// GET /api/bookings → fetch bookings only for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });
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

    // Only the user who booked can cancel
    if (booking.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Not authorized to cancel this booking" });

    // Update status
    booking.status = "user-cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (err) {
    console.error("Cancel booking error:", err);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});



export default router;
