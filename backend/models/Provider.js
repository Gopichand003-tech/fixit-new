import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  service: { type: String, required: true },
  experience: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  documents: {
    photo: { type: String },
    aadhaar: { type: String },
    pancard: { type: String },
  },
  membershipPaid: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Provider", providerSchema);
