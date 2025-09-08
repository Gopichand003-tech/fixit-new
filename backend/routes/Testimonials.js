import express from "express";
import Testimonial from "../models/Testimonial.js";
import { protect } from "../Middleware/authMiddleware.js"; // middleware that adds req.user

const router = express.Router();

// @desc Get all testimonials
// @route GET /api/testimonials
// @access Public
router.get("/", async (req, res) => {
  try {
    const testimonials = await Testimonial.find().populate("user", "name email");
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// @desc Add new testimonial
// @route POST /api/testimonials
// @access Private
router.post("/", protect, async (req, res) => {
  try {
    const { profession, feedback } = req.body;

    if (!feedback) {
      return res.status(400).json({ message: "Feedback is required" });
    }

    const newTestimonial = new Testimonial({
      user: req.user._id,   // ✅ from JWT
      profession,
      feedback,
    });

    const saved = await newTestimonial.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// @desc Update testimonial
// @route PUT /api/testimonials/:id
// @access Private (only owner)
router.put("/:id", protect, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Not found" });
    }

    // ✅ only owner can edit
    if (testimonial.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // ✅ only allow editing of profession & feedback
    testimonial.profession = req.body.profession || testimonial.profession;
    testimonial.feedback = req.body.feedback || testimonial.feedback;

    const updated = await testimonial.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// @desc Delete testimonial
// @route DELETE /api/testimonials/:id
// @access Private (only owner)
router.delete("/:id", protect, async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({ message: "Not found" });
    }

    // ✅ only owner can delete
    if (testimonial.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await testimonial.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
