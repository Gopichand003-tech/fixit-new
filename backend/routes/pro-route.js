import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import Provider from "../models/Provider.js";

const router = express.Router();

// Storage config for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/providers";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

/**
 * 📌 Register a provider
 */
router.post(
  "/",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "aadhaar", maxCount: 1 },
    { name: "pancard", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, service,experience, location, phone } = req.body; // ✅ include age + email

      const documents = {};
      if (req.files.photo) documents.photo = `/uploads/providers/${req.files.photo[0].filename}`;
      if (req.files.aadhaar) documents.aadhaar = `/uploads/providers/${req.files.aadhaar[0].filename}`;
      if (req.files.pancard) documents.pancard = `/uploads/providers/${req.files.pancard[0].filename}`;

      const provider = await Provider.create({
        name,
        service,
        experience,
        location,
        phone,
        documents,
      });

      res.status(201).json({ message: "Provider registered successfully", provider });
    } catch (err) {
      console.error("❌ Error registering provider:", err);
      res.status(500).json({ message: "Failed to register provider" });
    }
  }
);


/**
 * 📌 Get all providers
 */
router.get("/", async (req, res) => {
  try {
    const providers = await Provider.find();
    res.json(providers);
  } catch (err) {
    console.error("❌ Error fetching providers:", err);
    res.status(500).json({ message: "Failed to fetch providers" });
  }
});

/**
 * 📌 Get single provider by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: "Provider not found" });
    res.json(provider);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch provider" });
  }
});

/**
 * 📌 Update membership status
 */
router.patch("/:id/membership", async (req, res) => {
  try {
    const { membershipPaid } = req.body;
    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      { membershipPaid },
      { new: true }
    );
    if (!provider) return res.status(404).json({ message: "Provider not found" });
    res.json({ message: "Membership updated", provider });
  } catch (err) {
    res.status(500).json({ message: "Failed to update membership" });
  }
});

/**
 * 📌 Search providers by location or service
 * Example: /api/providers/search?location=Hyderabad&service=Plumber
 */
router.get("/search", async (req, res) => {
  try {
    const { location, service } = req.query;

    const filter = {};
    if (location) filter.location = { $regex: location, $options: "i" }; // case-insensitive match
    if (service) filter.service = { $regex: service, $options: "i" };

    const providers = await Provider.find(filter);

    res.json(providers);
  } catch (err) {
    console.error("❌ Error searching providers:", err);
    res.status(500).json({ message: "Failed to search providers" });
  }
});

// providers.js
router.delete("/:id", async (req, res) => {
  try {
    // Example: check admin via header
    const isAdmin = req.headers["x-admin-secret"] === process.env.ADMIN_SECRET;
    if (!isAdmin) {
      return res.status(403).json({ message: "Only admin can delete providers" });
    }

    const provider = await Provider.findByIdAndDelete(req.params.id);
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    res.json({ message: "Provider deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete provider" });
  }
});



export default router;
