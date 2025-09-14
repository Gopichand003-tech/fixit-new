// backend/utils/sendWhatsapp.js
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

/**
 * Send WhatsApp message to a worker
 * @param {string} workerNumber - e.g. "+91XXXXXXXXXX"
 * @param {string} taskMessage - message to send
 */
export const sendWhatsapp = async (workerNumber, taskMessage) => {
  if (!workerNumber || !taskMessage) {
    throw new Error("Missing workerNumber or taskMessage");
  }

  // Worker must have joined the Twilio Sandbox first
  const formattedNumber = `whatsapp:${workerNumber}`;

  return await client.messages.create({
    from: 'whatsapp:+14155238886', // Twilio sandbox number
    to: formattedNumber,
    body: taskMessage,
  });
};
