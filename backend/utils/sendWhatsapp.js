import Twilio from "twilio";

const client = new Twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

/**
 * Send a WhatsApp message using Twilio Sandbox
 * @param {string} to - Full number with country code, e.g., "+91XXXXXXXXXX"
 * @param {string} message - Message body
 */
export const sendWhatsapp = async (to, message) => {
  if (!to || !message) throw new Error("Missing 'to' number or 'message'");

  // Validate number format
  if (!/^\+\d{10,15}$/.test(to)) {
    throw new Error(
      "Invalid phone number format (must include country code, e.g. +91XXXXXXXXXX)"
    );
  }

  try {
    const res = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`, // Sandbox number
      to: `whatsapp:${to}`, // Recipient number
      body: message,
    });

    console.log(`✅ WhatsApp sent to ${to}:`, res.sid);
    return res;
  } catch (err) {
    console.error("❌ Twilio send error:", err?.message || err);
    throw new Error(err?.message || "Twilio failed to send WhatsApp message");
  }
};
