// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoute from "./routes/Authroute.js";
import otpRoute from "./routes/otpRoute.js";
import providerRoute from "./routes/pro-route.js";
import testimonialRoutes from "./routes/Testimonials.js";
import bookingsRoutes from "./routes/bookings.js";
import notificationsRoutes from "./routes/notifications.js";
import tasksRoute from "./routes/tasks.js"; // WhatsApp tasks

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- Middleware ----------
app.use(express.json());
app.use(
  cors({
    origin: [
      process.env.VITE_API_URL,
      process.env.VITE_API_URI,          // ✅ use .env for production frontend
    ],
    credentials: true,
  })
);

// ---------- MongoDB ----------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ---------- API Routes ----------
app.use("/api/auth", authRoute);
app.use("/api/otp", otpRoute);
app.use("/api/providers", providerRoute);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/tasks", tasksRoute); // WhatsApp tasks


// ---------- Static Files ----------
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "frontend-dist")));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend-dist", "index.html"));
});

// ---------- Server Listen ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
