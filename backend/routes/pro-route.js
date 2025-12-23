import express from "express";
import Provider from "../models/Provider.js";
import { uploadProviderFiles } from "../utils/cloudinary.js";

const router = express.Router();

/* Helper */
const normalizePhone = (phone) => {
  let clean = phone.replace(/\D/g, "");
  if (!clean.startsWith("91")) clean = "91" + clean;
  return clean;
};

/* ---------------- Get All Providers ---------------- */
router.get("/", async (_req, res) => {
  try {
    const providers = await Provider.find();
    res.json(providers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch providers" });
  }
});

/* ---------------- Register Provider ---------------- */
router.post(
  "/",
  uploadProviderFiles.fields([
    { name: "photo", maxCount: 1 },
    { name: "aadhaar", maxCount: 1 },
    { name: "pancard", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const provider = await Provider.create({
        name: req.body.name,
        email: req.body.email,
        phone: normalizePhone(req.body.phone),
        service: req.body.service,
        experience: req.body.experience,
        location: req.body.location,
        documents: {
          photo: req.files?.photo?.[0]?.secure_url,
          aadhaar: req.files?.aadhaar?.[0]?.secure_url,
          pancard: req.files?.pancard?.[0]?.secure_url,
        },
        emailVerified: true,
      });

      res.status(201).json({ success: true, provider });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

/* ---------------- WhatsApp Webhook ---------------- */
router.post("/whatsapp", async (req, res) => {
  try {
    const body = req.body.Body?.trim().toUpperCase();
    const raw = req.body.From.replace(/\D/g, "");
    const phone = raw.startsWith("91") ? raw : "91" + raw;

    const provider = await Provider.findOne({ phone });

    if (!provider) {
      return res.send(`
        <Response>
          <Message>❌ You are not registered as a FixIt service provider.</Message>
        </Response>
      `);
    }

    if (body === "START") {
      provider.isOnline = true;
      await provider.save();

      return res.send(`
        <Response>
          <Message>📩 Availability Activated

You are now ONLINE 🟢
Customers can view your profile and send service requests.

Type *LEAVE* anytime to go offline.</Message>
        </Response>
      `);
    }

    if (body === "STOP" || body === "LEAVE") {
      provider.isOnline = false;
      await provider.save();

      return res.send(`
        <Response>
          <Message>📩 Status Updated

You are now OFFLINE 🔴
You will not receive new booking requests.

Type *START* to go online again.</Message>
        </Response>
      `);
    }

    return res.send(`
      <Response>
        <Message>
Commands:
START – Go Online
STOP / LEAVE – Go Offline
        </Message>
      </Response>
    `);
  } catch (err) {
    console.error(err);
    return res.send(`
      <Response>
        <Message>⚠️ Server error. Try again later.</Message>
      </Response>
    `);
  }
});

export default router;
