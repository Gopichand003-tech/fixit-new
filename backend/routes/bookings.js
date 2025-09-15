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
    const { workerId, workerName, workerPhone, issue, price, userName, userPhone, userAddress, timeSlot } = req.body;

    // Basic validation
    if (!workerId || !workerName || !workerPhone || !issue || !price || !userName || !userPhone || !userAddress || !timeSlot) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const bookingData = {
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
    };

    const booking = new Booking(bookingData);
    await booking.save();

    // WhatsApp message to worker with Accept/Reject links
    const acceptUrl = `${process.env.VITE_API_URL}/api/bookings/${booking._id}/worker/accept?code=${booking.confirmationCode}`;
    const rejectUrl = `${process.env.VITE_API_URL}/api/bookings/${booking._id}/worker/reject?code=${booking.confirmationCode}`;

    const msg = `🔔 *New Booking Request*
Issue: ${booking.issue}
Price: ₹${booking.price}
User: ${booking.userName} (${booking.userPhone})
Address: ${booking.userAddress}
Time Slot: ${booking.timeSlot}

Accept 👉 ${acceptUrl}
Reject 👉 ${rejectUrl}`;

    try {
      await sendWhatsapp(workerPhone, msg);
    } catch (err) {
      console.error("Worker WhatsApp failed:", err);
    }

    res.status(201).json({ message: "Booking created & request sent to worker", booking });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: "Failed to save booking" });
  }
});

/**
 * GET /api/bookings
 * Fetch all bookings for the logged-in user
 */
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

/**
 * PATCH /api/bookings/:id/worker/view
 * Called when worker opens booking link → update status to worker-viewed
 */
router.patch("/:id/worker/view", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    booking.status = "worker-viewed";
    booking.workerViewedAt = new Date();
    await booking.save();

    res.json({ message: "Worker viewed the booking", booking });
  } catch (error) {
    console.error("Worker view error:", error);
    res.status(500).json({ error: "Failed to update worker view" });
  }
});

/**
 * PATCH /api/bookings/:id/worker/accept
 * Called when worker clicks "Accept" link
 */
router.patch("/:id/worker/accept", async (req, res) => {
  try {
    const { code } = req.query;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.confirmationCode !== code) {
      return res.status(403).json({ error: "Invalid confirmation code" });
    }

    booking.status = "worker-accepted";
    booking.decisionAt = new Date();
    await booking.save();

    // Notify user that worker accepted
    if (booking.userPhone) {
      const msg = `✅ Your booking for *${booking.issue}* has been accepted by ${booking.workerName}.
We will confirm shortly.`;
      try {
        await sendWhatsapp(booking.userPhone, msg);
      } catch (err) {
        console.error("User WhatsApp failed:", err);
      }
    }

    res.json({ message: "Worker accepted booking", booking });
  } catch (error) {
    console.error("Worker accept error:", error);
    res.status(500).json({ error: "Failed to accept booking" });
  }
});

/**
 * PATCH /api/bookings/:id/worker/reject
 */
router.patch("/:id/worker/reject", async (req, res) => {
  try {
    const { code } = req.query;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.confirmationCode !== code) {
      return res.status(403).json({ error: "Invalid confirmation code" });
    }

    booking.status = "worker-rejected";
    booking.decisionAt = new Date();
    await booking.save();

    // Notify user
    if (booking.userPhone) {
      const msg = `❌ Your booking for *${booking.issue}* was rejected by ${booking.workerName}. Please choose another worker.`;
      try {
        await sendWhatsapp(booking.userPhone, msg);
      } catch (err) {
        console.error("User WhatsApp failed:", err);
      }
    }

    res.json({ message: "Worker rejected booking", booking });
  } catch (error) {
    console.error("Worker reject error:", error);
    res.status(500).json({ error: "Failed to reject booking" });
  }
});

/**
 * PATCH /api/bookings/:id/confirm
 * Final system confirmation (e.g. after payment)
 */
router.patch("/:id/confirm", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    booking.status = "confirmed";
    await booking.save();

    if (booking.userPhone) {
      const msg = `🎉 Booking confirmed for *${booking.issue}* with ${booking.workerName}.
Location: ${booking.userAddress}
Time: ${booking.timeSlot}`;
      try {
        await sendWhatsapp(booking.userPhone, msg);
      } catch (err) {
        console.error("User WhatsApp failed:", err);
      }
    }

    res.json({ message: "Booking confirmed successfully", booking });
  } catch (error) {
    console.error("Confirm error:", error);
    res.status(500).json({ error: "Failed to confirm booking" });
  }
});

/**
 * PATCH /api/bookings/:id/status
 * Generic update (e.g. completed, cancelled)
 */
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    booking.status = status;
    await booking.save();
    res.json({ message: `Booking status updated to ${status}`, booking });
  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ error: "Failed to update booking status" });
  }
});

export default router;
