// frontend/utils/sendWhatsapp.js
import axios from "axios";

/**
 * Send a WhatsApp message via backend API
 * @param {string} workerNumber - WhatsApp number of worker (+91XXXXXXXXXX)
 * @param {string} taskMessage - Message to send
 * @returns {Promise<{ status: 'success' | 'failed', error?: string }>}
 */
export const sendWhatsapp = async (workerNumber, taskMessage) => {
  // ✅ Basic validations
  if (!workerNumber || !taskMessage) {
    console.error("❌ Missing workerNumber or taskMessage");
    return { status: "failed", error: "Missing workerNumber or taskMessage" };
  }

  // ✅ Simple number format check (expects +countrycodeXXXXXXXXXX)
  if (!/^\+\d{10,15}$/.test(workerNumber)) {
    console.error("❌ Invalid phone number format. Example: +911234567890");
    return { status: "failed", error: "Invalid phone number format" };
  }

  try {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) {
      console.error("❌ VITE_API_URL is not defined in .env");
      return { status: "failed", error: "API URL not configured" };
    }

    const res = await axios.post(
      `${API_URL}/api/tasks/send-whatsapp`,
      { workerNumber, taskMessage },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("✅ WhatsApp message sent successfully:", res.data);

    // ✅ Return standardized status
    return { status: "success" };
  } catch (err) {
    let errorMsg = "";

    if (err.response) {
      console.error(
        `❌ Backend error [${err.response.status}]:`,
        err.response.data
      );
      errorMsg = err.response.data?.error || err.response.data || "Backend error";
    } else if (err.request) {
      console.error("❌ No response from backend. Network/Server issue:", err.request);
      errorMsg = "No response from backend";
    } else {
      console.error("❌ Error setting up request:", err.message);
      errorMsg = err.message;
    }

    return { status: "failed", error: errorMsg };
  }
};
