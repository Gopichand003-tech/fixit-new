import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  profession: { type: String },
  feedback: { type: String, required: true },
   profilePic: { type: String, default: null }, // optional profile picture
}, { timestamps: true });

export default mongoose.model("Testimonial", testimonialSchema);
