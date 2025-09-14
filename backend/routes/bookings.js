import express from "express";
import Booking from "../models/booking.js";
import protect from "../Middleware/authMiddleware.js";

const router = express.Router();

// ✅ Protect all booking routes
router.use(protect);

// POST /api/bookings - create new booking
router.post("/", async (req, res) => {
  try {
    const bookingData = { ...req.body, userId: req.user._id }; // attach logged-in user
    const booking = new Booking(bookingData);
    await booking.save();
    res.status(201).json({ message: "Booking saved successfully", booking });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ error: "Failed to save booking" });
  }
});

// GET /api/bookings - list bookings for logged-in user
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// PATCH /api/bookings/:id/confirm - confirm a booking
router.patch("/:id/confirm", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // Optional: only owner can confirm
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    booking.status = "Confirmed";
    await booking.save();
    res.json({ message: "Booking confirmed successfully", booking });
  } catch (error) {
    console.error("Confirm error:", error);
    res.status(500).json({ error: "Failed to confirm booking" });
  }
});

// PATCH /api/bookings/:id/reject - reject a booking
router.patch("/:id/reject", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // Optional: only owner can reject
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    booking.status = "Rejected";
    await booking.save();
    res.json({ message: "Booking rejected successfully", booking });
  } catch (error) {
    console.error("Reject error:", error);
    res.status(500).json({ error: "Failed to reject booking" });
  }
});

// PATCH /api/bookings/:id/status - generic update
router.patch("/:id/status", async (req, res) => {
  try {
    const { status, confirmationCode } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // Only owner can update
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (status) booking.status = status;
    if (confirmationCode) booking.confirmationCode = confirmationCode;

    await booking.save();
    res.json({ message: "Booking status updated", booking });
  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ error: "Failed to update booking status" });
  }
});

export default router;
