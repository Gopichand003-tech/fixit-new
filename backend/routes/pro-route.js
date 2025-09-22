import express from "express";
import Provider from "../models/Provider.js";
import { uploadProviderFiles } from "../utils/cloudinary.js"; // ✅ Cloudinary multer

const router = express.Router();

/* ---------------------- Helper ---------------------- */
// Always prefer secure_url if available
const getCloudUrl = (fileArr) =>
  fileArr?.[0]?.secure_url || fileArr?.[0]?.path || "";

/* ---------------------- Routes ---------------------- */

// 1️⃣ Search providers
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

// 2️⃣ Get all providers
router.get("/", async (_req, res) => {
  try {
    const providers = await Provider.find();
    res.json(providers);
  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({ message: "Failed to fetch providers" });
  }
});

// 3️⃣ Register provider with Cloudinary uploads
router.post(
  "/",
  uploadProviderFiles.fields([
    { name: "photo", maxCount: 1 },
    { name: "aadhaar", maxCount: 1 },
    { name: "pancard", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      console.log("✅ Uploaded to Cloudinary:", req.files);

      const provider = await Provider.create({
        name: req.body.name,
        service: req.body.service,
        experience: req.body.experience,
        location: req.body.location,
        phone: req.body.phone,
        documents: {
          photo: getCloudUrl(req.files.photo),
          aadhaar: getCloudUrl(req.files.aadhaar),
          pancard: getCloudUrl(req.files.pancard),
        },
        membershipPaid: false,
      });

      res.status(201).json({
        message: "Provider registered successfully",
        provider,
      });
    } catch (err) {
      console.error("❌ Provider Create Error:", err);
      res.status(500).json({ message: "Failed to create provider" });
    }
  }
);

// 4️⃣ Update membership
router.patch("/:id/membership", async (req, res) => {
  try {
    const { membershipPaid } = req.body;
    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      { membershipPaid },
      { new: true }
    );
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });
    res.json({ message: "Membership updated", provider });
  } catch (err) {
    console.error("Membership Update Error:", err);
    res.status(500).json({ message: "Failed to update membership" });
  }
});

// 5️⃣ Delete provider
router.delete("/:id", async (req, res) => {
  try {
    const isAdmin = req.headers["x-admin-secret"] === process.env.ADMIN_SECRET;
    if (!isAdmin)
      return res.status(403).json({ message: "Only admin can delete providers" });

    const provider = await Provider.findByIdAndDelete(req.params.id);
    if (!provider)
      return res.status(404).json({ message: "Provider not found" });

    res.json({ message: "Provider deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Failed to delete provider" });
  }
});

export default router;
