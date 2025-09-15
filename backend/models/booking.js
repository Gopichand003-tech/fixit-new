import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  workerName: { type: String, required: true },

  issue: { type: String, required: true },
  price: { type: Number, required: true },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: { type: String, required: true },
  userPhone: { type: String, required: true },
  userAddress: { type: String, required: true },

  timeSlot: { type: String, required: true },

  status: {
    type: String,
    enum: [
      "pending",
      "request-sent",
      "worker-viewed",
      "worker-accepted",
      "worker-rejected",
      "confirmed",
      "user-cancelled",
      "completed",
      "closed",
    ],
    default: "pending",
  },

  confirmationCode: { type: String },

  requestSentAt: { type: Date },
  workerViewedAt: { type: Date },
  decisionAt: { type: Date },

  paymentStatus: {
    type: String,
    enum: ["Unpaid", "Paid", "Refunded", "Partial"],
    default: "Unpaid",
  },

  createdAt: { type: Date, default: Date.now },
});

// ✅ Add indexes for faster queries
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ workerId: 1, status: 1 });

export default mongoose.model("Booking", bookingSchema);
