import express from "express";
import Booking from "../models/booking.js";
import protect from "../Middleware/authMiddleware.js";
import { sendWhatsapp } from "../utils/sendWhatsapp.js";
import crypto from "crypto";

const router = express.Router();

/* ======================================================
   CREATE BOOKING (USER)
====================================================== */
router.post("/", protect, async (req, res) => {
  try {
    const {
      workerId,
      workerName,
      workerPhone,
      issues,
      totalPrice,
      userName,
      userPhone,
      userAddress,
      timeSlot,
    } = req.body;

    if (
      !workerId ||
      !workerName ||
      !workerPhone ||
      !Array.isArray(issues) ||
      issues.length === 0 ||
      !totalPrice ||
      !userName ||
      !userPhone ||
      !userAddress ||
      !timeSlot
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const booking = new Booking({
      workerId,
      workerName,
      workerPhone,
      issues,
      issue: issues.map(i => i.label).join(", "),
      price: totalPrice,
      userId: req.user._id,
      userName,
      userPhone,
      userAddress,
      timeSlot,
      status: "request-sent",
      confirmationCode: crypto.randomBytes(6).toString("hex"),
    });

    console.log("📦 Booking object:", booking);

    await booking.save();

    /* -------- Send WhatsApp to Worker -------- */
    let wp = workerPhone.replace(/\D/g, "");
    if (!wp.startsWith("91")) wp = "91" + wp;
    wp = "+" + wp;

    const msg = `🔔 *New Booking Request!*

You’ve received a new service request !

*Booking ID:* ${booking._id}  
*Service:* ${booking.issue}  
*Estimated Price:* ₹${booking.price}  
*Customer:* ${booking.userName}  
*Scheduled Time:* ${booking.timeSlot}

👉 *Respond now:*

 *ACCEPT* — to confirm this booking  
 *REJECT* — to decline this booking  

You can also reply with a specific ID if needed:

ACCEPT ${booking._id}  
REJECT ${booking._id}

 Quick responses help you get more bookings!
`;

   try {
  await sendWhatsapp(wp, msg);
} catch (err) {
  console.warn("⚠️ WhatsApp send failed:", err.message);
}


    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
  console.error("❌ Booking error FULL:", err);
  res.status(500).json({
    error: err.message || "Failed to save booking",
  });
}

});

/* ================= USER BOOKINGS ================= */
router.get("/", protect, async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id });
  res.json({ bookings });
});

/* ================= USER CANCEL BOOKING ================= */
router.patch("/:id/cancel", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking)
      return res.status(404).json({ error: "Booking not found" });

    if (booking.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Not authorized" });

    booking.status = "user-cancelled";
    await booking.save();

    let phone = booking.workerPhone.replace(/\D/g, "");
    if (!phone.startsWith("91")) phone = "91" + phone;
    phone = "+" + phone;

    await sendWhatsapp(
      phone,
      `❌ *Booking Update*

*The booking has been cancelled by the customer.*

*Service:* ${booking.issue}  
*Scheduled Time:* ${booking.timeSlot}

Thank you for your understanding.  
No worries! New requests may arrive soon.  

🚩 *Stay online to keep receiving bookings*
`

    );

    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    console.error("Cancel error:", err);
    res.status(500).json({ error: "Cancel failed" });
  }
});

export default router;
