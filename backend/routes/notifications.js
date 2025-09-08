// routes/notifications.js
import express from "express";

const router = express.Router();

// Temporary in-memory notifications storage
let notifications = [];

// POST /api/notifications - send notification to worker
router.post("/", async (req, res) => {
  try {
    const { workerId, message } = req.body;
    const newNotification = { workerId, message, createdAt: new Date() };
    notifications.push(newNotification);

    console.log(`Notification for Worker(${workerId}): ${message}`);
    res.status(200).json({ message: "Notification sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

// GET /api/notifications - fetch all notifications
router.get("/", async (req, res) => {
  try {
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

export default router;
