import express from "express";
import Booking from "../models/booking.js";
import Provider from "../models/Provider.js";
import { sendWhatsapp } from "../utils/sendWhatsapp.js";

const router = express.Router();

router.post("/webhook", async (req, res) => {
  try {
    const body = req.body.Body?.trim();
    const from = req.body.From; // +91xxxx

    if (!body) {
      return res.send("<Response><Message>Invalid message</Message></Response>");
    }

    const provider = await Provider.findOne({
      phone: from.replace(/\D/g, ""),
    });

    if (!provider) {
      return res.send("<Response><Message>❌ Provider not found</Message></Response>");
    }

    /* ================= ACCEPT / REJECT ================= */
    if (body.startsWith("ACCEPT") || body.startsWith("REJECT")) {
      const [action, bookingId] = body.split(" ");

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.send("<Response><Message>❌ Booking not found</Message></Response>");
      }

      if (booking.workerId.toString() !== provider._id.toString()) {
        return res.send("<Response><Message>⛔ Not your booking</Message></Response>");
      }

      booking.status =
        action === "ACCEPT" ? "worker-accepted" : "worker-rejected";
      await booking.save();

      //user notify

return res.send(`
  <Response>
    <Message>
✅ Booking ${action}ED successfully.

Thank you for responding promptly.
You may receive more requests soon 🚀
    </Message>
  </Response>
`);

    }

    /* ================= HELP ================= */
    return res.send(`
      <Response>
        <Message>
Commands:
START – Go Online
STOP / LEAVE – Go Offline

ACCEPT &lt;BookingId&gt;
REJECT &lt;BookingId&gt;
        </Message>
      </Response>
    `);
  } catch (err) {
    console.error("Webhook error:", err);
    res.send("<Response><Message>⚠️ Server error</Message></Response>");
  }
});

export default router;
