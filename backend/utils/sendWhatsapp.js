import Twilio from "twilio";

const client = new Twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

/**
 * Send WhatsApp (normal text or interactive)
 **/
export const sendWhatsapp = async (to, message) => {
  if (!to) throw new Error("Missing 'to' number");
  if (!/^\+\d{10,15}$/.test(to)) throw new Error("Invalid phone format");

  try {
    const res = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:${to}`,
      body: message, // ✅ Only text
    });
    console.log(`✅ WhatsApp sent to ${to}:`, res.sid);
    return res;
  } catch (err) {
    console.error("❌ Twilio send error:", err.message || err);
    throw new Error(err.message || "Twilio failed");
  }
};
