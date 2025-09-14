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
import tasksRoute from "./routes/tasks.js"; // <-- WhatsApp route

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",              // local frontend
    "https://fix-it-400z.onrender.com"   // deployed frontend
  ],
  credentials: true,
}));

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

// WhatsApp route
app.use("/api/tasks",tasksRoute);
console.log("✅ WhatsApp routes loaded");

// Static for profile pics
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve React frontend
app.use(express.static(path.join(__dirname, "frontend-dist")));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend-dist", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
