import express from "express";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);

  await sendEmail({
    to: email,
    subject: "Your OTP Verification Code",
    html: `
      <h2>OTP Verification</h2>
      <p>Your OTP is:</p>
      <h1 style="color:#2563eb">${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
    `,
  });

  res.json({ message: "OTP sent successfully", otp });
});

// Thank you and explain of twilio usage message in email

router.post("/send-provider-welcome", async (req, res) => {
  const { email, name } = req.body;

  try {
   await sendEmail({
  to: email,
  subject: "Welcome to FixIt – You’re Live! 🎈",
  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.7; color:#333;">
      
      <h2>Welcome ${name} 👋</h2>

      <p>
        Thank you for becoming a <strong>FixIt Service Provider</strong>.
        We’re excited to have you on our platform!
      </p>

      <p>
        You can now receive service booking requests by managing your
        <strong>online / offline status</strong> through WhatsApp.
      </p>

      <hr style="margin:20px 0;" />

      <h3> Important WhatsApp Setup !!</h3>

      <p>
        <strong>Click the number below to open WhatsApp:</strong><br />
        👉 
        <a 
          href="https://wa.me/14155238886" 
          target="_blank"
          style="color:#16a34a; font-weight:bold; text-decoration:none;"
        >
          +1 415 523 8886
        </a>
      </p>

      <p>Follow these simple steps carefully:</p>

      <ol>
        <li>
          Open WhatsApp and send this message:<br />
          <strong style="background:#f1f5f9; padding:6px 10px; border-radius:6px;">
            Join accident-first
          </strong>
        </li>

        <li>
          To start receiving booking requests:<br />
          <strong>Send:</strong> <code>start</code> (Go Online)
        </li>

        <li>
          To stop receiving booking requests:<br />
          <strong>Send:</strong> <code>leave</code> (Go Offline)
        </li>

        <li>
          To disconnect WhatsApp integration:<br />
          <strong>Send:</strong> <code>stop</code>
        </li>
      </ol>

      <div style="margin-top:16px; padding:12px; background:#ecfdf5; border-left:4px solid #16a34a;">
        <strong>NOTE:</strong> Please complete these steps <u>every day</u> 
        to stay online and receive booking requests without interruption.
      </div>

      <p style="margin-top:20px;">
        ✨ Wishing you great success with FixIt!
      </p>

      <p style="margin-top:20px;">
        — Team <strong>FixIt</strong>
      </p>
    </div>
  `,
});


    res.json({ message: "Welcome email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send welcome email" });
  }
});


export default router;
