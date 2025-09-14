import axios from 'axios';

/**
 * Call backend API to send WhatsApp message
 * @param {string} workerNumber - WhatsApp number of worker (+91XXXXXXXXXX)
 * @param {string} taskMessage - Message to send
 */
export const sendWhatsapp = async (workerNumber, taskMessage) => {
  try {
    const res = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/tasks/send-whatsapp`,
  { workerNumber, taskMessage },
  { headers: { "Content-Type": "application/json" } }
);

    console.log("WhatsApp message sent:", res.data);
  } catch (err) {
    console.error("Error sending WhatsApp message:", err);
  }
};
