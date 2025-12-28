import Twilio from "twilio";

const client = new Twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

/**
 * Base WhatsApp sender
 * Expects E.164 format: +91XXXXXXXXXX
 */
export const sendWhatsapp = async (to, message) => {
  if (!to) throw new Error("Missing 'to' number");
  if (!/^\+\d{10,15}$/.test(to))
    throw new Error(`Invalid phone format: ${to}`);
  if (!message) throw new Error("Missing 'message'");

  const res = await client.messages.create({
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
    to: `whatsapp:${to}`,
    body: message,
  });

  console.log(`✅ WhatsApp sent to ${to}: ${res.sid}`);
  return res;
};

/**
 * Send booking request to provider
 */
export const sendBookingWhatsapp = async ({
  to,
  bookingId,
  issues,
  totalPrice,
  userName,
  timeSlot,
}) => {
  const issueText = Array.isArray(issues)
    ? issues.map(i => i.label).join(", ")
    : issues;

  const msg = `🔔 *New Booking Request*

Booking ID: ${bookingId}

Issues: ${issueText}
Total Price: ₹${totalPrice}
Customer: ${userName}
Time: ${timeSlot}

👉 Reply with:
*ACCEPT*  – Accept latest booking
*REJECT*  – Reject latest booking

or

*ACCEPT ${bookingId}*
*REJECT ${bookingId}*`;

  return sendWhatsapp(to, msg);
};
