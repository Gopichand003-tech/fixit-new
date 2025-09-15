// frontend/utils/sendWhatsapp.js
import axios from "axios";

/**
 * Send a WhatsApp message via backend API
 * @param {string} workerNumber - WhatsApp number of worker (+91XXXXXXXXXX)
 * @param {string} taskMessage - Message to send
 */
export const sendWhatsapp = async (workerNumber, taskMessage) => {
  // ✅ Basic validations
  if (!workerNumber || !taskMessage) {
    console.error("❌ Missing workerNumber or taskMessage");
    return;
  }

  // ✅ Optional: simple number format check (expects +countrycodeXXXXXXXXXX)
  if (!/^\+\d{10,15}$/.test(workerNumber)) {
    console.error("❌ Invalid phone number format. Example: +911234567890");
    return;
  }

  try {
    const API_URL = import.meta.env.VITE_API_URL;
    if (!API_URL) {
      console.error("❌ VITE_API_URL is not defined in .env");
      return;
    }

    const res = await axios.post(
      `${API_URL}/api/tasks/send-whatsapp`,
      { workerNumber, taskMessage },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("✅ WhatsApp message sent successfully:", res.data);
    return res.data;
  } catch (err) {
    // ✅ Detailed error handling
    if (err.response) {
      console.error(
        `❌ Backend error [${err.response.status}]:`,
        err.response.data
      );
    } else if (err.request) {
      console.error("❌ No response from backend. Network/Server issue:", err.request);
    } else {
      console.error("❌ Error setting up request:", err.message);
    }
  }
};
