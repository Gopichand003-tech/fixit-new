import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  workerName: { type: String, required: true },
  issue: { type: String, required: true },
  price: { type: Number, required: true },
  userName: { type: String, required: true },
  userPhone: { type: String, required: true },
  userAddress: { type: String, required: true },
  timeSlot: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Booking", bookingSchema);
