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
      required: true,
      trim: true, // stored as +91XXXXXXXXXX
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
      photo: String,
      aadhaar: String,
      pancard: String,
    },

    /* 🔥 ONLINE STATUS (ONLY SOURCE OF TRUTH) */
    isOnline: {
      type: Boolean,
      default: false,
    },

    /* ---------------- Verification & Payment ---------------- */
    emailVerified: {
      type: Boolean,
      default: false,
    },

    membershipPaid: {
      type: Boolean,
      default: false,
    },

    /* ---------------- Admin Control ---------------- */
    approvedByAdmin: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Provider", providerSchema);

