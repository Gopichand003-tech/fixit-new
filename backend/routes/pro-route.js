import express from "express";
import Provider from "../models/Provider.js";
import Booking from "../models/booking.js";
import { uploadProviderFiles } from "../utils/cloudinary.js";
import { sendWhatsapp } from "../utils/sendWhatsapp.js";

const router = express.Router();

/* ================= PHONE NORMALIZER ================= */
const normalizePhone = (phone) => {
  let clean = phone.replace(/\D/g, "");
  if (clean.startsWith("0")) clean = clean.slice(1);
  if (clean.length === 10) clean = "91" + clean;
  return clean;
};

/* ================= GET ALL PROVIDERS ================= */
router.get("/", async (_req, res) => {
  try {
    const providers = await Provider.find();
    res.json(providers);
  } catch {
    res.status(500).json({ message: "Failed to fetch providers" });
  }
});


/* ================= REGISTER PROVIDER ================= */
router.post(
  "/",
  uploadProviderFiles.fields([
    { name: "photo", maxCount: 1 },
    { name: "aadhaar", maxCount: 1 },
    { name: "pancard", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log("🔥 PROVIDER API HIT");
      console.log("REQ BODY:", req.body);
      console.log("REQ FILES:", req.files);

      const { name, phone, service, experience, location } = req.body;

      // 🛑 HARD STOP — NO MORE VALIDATION ERRORS
      if (!name || !phone || !service || !experience || !location) {
        return res.status(400).json({
          message: "Invalid provider submission",
          received: req.body,
        });
      }

      const exists = await Provider.findOne({ phone });
      if (exists) {
        return res.status(409).json({
          message: "Provider already registered with this phone number",
        });
      }

      const provider = await Provider.create({
        name,
        phone,
        service,
        experience,
        location,
        documents: {
          photo: req.files?.photo?.[0]?.path || "",
          aadhaar: req.files?.aadhaar?.[0]?.path || "",
          pancard: req.files?.pancard?.[0]?.path || "",
        },
      });

      res.status(201).json(provider);
    } catch (err) {
      console.error("PROVIDER ERROR:", err); 
      res.status(500).json({ message: "Server error" });
    }
  }
);



/* ======================================================
   WHATSAPP WEBHOOK (ONLINE / OFFLINE + BOOKING ACTIONS)
====================================================== */
router.post("/whatsapp", async (req, res) => {
  try {
    const bodyRaw = req.body.Body || "";
    const body = bodyRaw.trim().toUpperCase();

    const rawFrom = req.body.From || "";
    const phone = normalizePhone(rawFrom.replace(/\D/g, ""));

    const provider = await Provider.findOne({ phone });
    if (!provider) {
      return res.send(`
        <Response>
          <Message>❌ You are not registered as a FixIt provider.</Message>
        </Response>
      `);
    }

    /* ================= ONLINE / OFFLINE ================= */
    if (body === "START") {
      provider.isOnline = true;
      await provider.save();

      return res.send(`
        <Response>
          <Message>🟢 You are ONLINE.
You will now receive booking requests.</Message>
        </Response>
      `);
    }

    if (body === "STOP" || body === "LEAVE") {
      provider.isOnline = false;
      await provider.save();

      return res.send(`
        <Response>
          <Message>🔴 You are OFFLINE.
You will not receive bookings.</Message>
        </Response>
      `);
    }

    /* ================= ACCEPT / REJECT ================= */
    if (
      body === "ACCEPT" ||
      body === "REJECT" ||
      body.startsWith("ACCEPT") ||
      body.startsWith("REJECT")
    ) {
      if (!provider.isOnline) {
        return res.send(`
          <Response>
            <Message>🔴 You are OFFLINE.
Type START to go online.</Message>
          </Response>
        `);
      }

      const [action, bookingId] = body.split(" ");

      const booking = bookingId
        ? await Booking.findById(bookingId)
        : await Booking.findOne({
            workerId: provider._id,
            status: "request-sent",
          }).sort({ createdAt: -1 });

      if (!booking) {
        return res.send(`
          <Response>
            <Message>❌ No pending booking found.</Message>
          </Response>
        `);
      }

      if (booking.workerId.toString() !== provider._id.toString()) {
        return res.send(`
          <Response>
            <Message>⛔ This booking is not assigned to you.</Message>
          </Response>
        `);
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

Booking:
ACCEPT
REJECT
or
ACCEPT &lt;BookingId&gt;
REJECT &lt;BookingId&gt;
        </Message>
      </Response>
    `);
  } catch (err) {
    console.error("WhatsApp webhook error:", err);
    return res.send(`
      <Response>
        <Message>⚠️ Server error. Try again later.</Message>
      </Response>
    `);
  }
});

export default router;
