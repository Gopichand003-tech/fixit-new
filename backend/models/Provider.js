import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    /* ---------------- Basic Info ---------------- */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true, // ✅ kept ONLY for display / calling
      trim: true,
    },

    /* ---------------- Service Info ---------------- */
    service: {
      type: String,
      required: true,
    },

    experience: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    /* ---------------- Documents ---------------- */
    documents: {
      photo: { type: String },    // Cloudinary URL
      aadhaar: { type: String },  // Cloudinary URL
      pancard: { type: String },  // Cloudinary URL
    },

    /* 🔥 REAL-TIME STATUS */
    lastSeen: {
      type: Date,
      default: Date.now,
    },

    /* ---------------- Verification & Payment ---------------- */
    emailVerified: {
      type: Boolean,
      default: false, // ✅ set true after OTP verify
    },

    membershipPaid: {
      type: Boolean,
      default: false,
    },

    /* ---------------- Admin Control (optional but recommended) ---------------- */
    approvedByAdmin: {
      type: Boolean,
      default: true, // set false if manual approval needed
    },
  },
  {
    timestamps: true,
  }
);

/* 🔥 Virtual Online Status (NO DB WRITE) */
providerSchema.virtual("isOnline").get(function () {
  const FIVE_MIN = 5 * 60 * 1000;
  return Date.now() - new Date(this.lastSeen).getTime() < FIVE_MIN;
});

providerSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Provider", providerSchema);
