// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./routes/Authroute.js"; 
import otpRoute from "./routes/otpRoute.js";
import providerRoute from "./routes/pro-route.js";
import testimonialRoutes from "./routes/Testimonials.js";
import bookingsRoutes from "./routes/bookings.js";
import notificationsRoutes from "./routes/notifications.js";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors());

// DB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/otp", otpRoute);   // <--- OTP route
console.log("✅ OTP routes loaded");

app.use("/api/providers", providerRoute);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/notifications", notificationsRoutes);

// Static for profile pics
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
