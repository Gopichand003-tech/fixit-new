import express from "express";
import Provider from "../models/Provider.js";
import { uploadProviderFiles } from "../utils/cloudinary.js";

const router = express.Router();

/* ---------------------- Helper ---------------------- */
const getCloudUrl = (fileArr) =>
  fileArr?.[0]?.secure_url || fileArr?.[0]?.path || "";

/* ---------------------- Routes ---------------------- */

/* 1️⃣ Search providers */
router.get("/search", async (req, res) => {
  try {
    const { location, service } = req.query;
    const filter = {};

    if (location) filter.location = { $regex: location, $options: "i" };
    if (service) filter.service = { $regex: service, $options: "i" };

    const providers = await Provider.find(filter);
    res.json(providers);
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ message: "Failed to search providers" });
  }
});

/* 2️⃣ Get all providers */
router.get("/", async (_req, res) => {
  try {
    const providers = await Provider.find();
    res.json(providers);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch providers" });
  }
});

/* 3️⃣ Register provider */
router.post(
  "/",
  uploadProviderFiles.fields([
    { name: "photo", maxCount: 1 },
    { name: "aadhaar", maxCount: 1 },
    { name: "pancard", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log("REQ BODY:", req.body);
      console.log("FILES:", req.files);

      const provider = await Provider.create({
        name: req.body.name,
        email: req.body.email,              // ✅ REQUIRED
        phone: req.body.phone,              // ✅ REQUIRED
        service: req.body.service,
        experience: req.body.experience,
        location: req.body.location,

        documents: {
          photo: getCloudUrl(req.files?.photo),
          aadhaar: getCloudUrl(req.files?.aadhaar),
          pancard: getCloudUrl(req.files?.pancard),
        },

        emailVerified: true,                 // ✅ since OTP already verified
        membershipPaid: false,
      });

      res.status(201).json({
        success: true,
        message: "Provider registered successfully",
        provider,
      });
    } catch (err) {
      console.error("❌ Provider Create Error:", err);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
);

/* 4️⃣ Update membership */
router.patch("/:id/membership", async (req, res) => {
  try {
    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      { membershipPaid: req.body.membershipPaid },
      { new: true }
    );

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.json({ message: "Membership updated", provider });
  } catch (err) {
    console.error("Membership Update Error:", err);
    res.status(500).json({ message: "Failed to update membership" });
  }
});

/* 5️⃣ Delete provider (Admin only) */
router.delete("/:id", async (req, res) => {
  try {
    const isAdmin =
      req.headers["x-admin-secret"] === process.env.ADMIN_SECRET;

    if (!isAdmin) {
      return res.status(403).json({ message: "Only admin can delete providers" });
    }

    const provider = await Provider.findByIdAndDelete(req.params.id);

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.json({ message: "Provider deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Failed to delete provider" });
  }
});

// status badge
router.patch("/:id/heartbeat", async (req, res) => {
  try {
    await Provider.findByIdAndUpdate(req.params.id, {
      lastSeen: new Date(),
    });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: "Heartbeat failed" });
  }
});

// Whatsapp webhook
router.post("/whatsapp", async (req, res) => {
  try {
    const from = req.body.From;          // whatsapp:+91XXXXXXXXXX
    const body = req.body.Body?.trim().toUpperCase();

    const phone = from.replace("whatsapp:", "");

    const provider = await Provider.findOne({ phone });

    if (!provider) {
      return res.send(`
        <Response>
          <Message>You are not registered as a provider.</Message>
        </Response>
      `);
    }

    if (body === "START") {
      provider.lastSeen = new Date();
      await provider.save();

      return res.send(`
        <Response>
          <Message>You are now ONLINE ✅</Message>
        </Response>
      `);
    }

    if (body === "STOP") {
      provider.lastSeen = new Date(0); // force offline
      await provider.save();

      return res.send(`
        <Response>
          <Message>You are now OFFLINE ❌</Message>
        </Response>
      `);
    }

    if (body === "STATUS") {
      const online = provider.isOnline ? "ONLINE ✅" : "OFFLINE ❌";

      return res.send(`
        <Response>
          <Message>Your status: ${online}</Message>
        </Response>
      `);
    }

    return res.send(`
      <Response>
        <Message>
Commands:
START – Go Online
STOP – Go Offline
STATUS – Check status
        </Message>
      </Response>
    `);

  } catch (err) {
    console.error(err);
    res.send(`
      <Response>
        <Message>Server error. Try again later.</Message>
      </Response>
    `);
  }
});


export default router;
