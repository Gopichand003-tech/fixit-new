import dotenv from 'dotenv';
dotenv.config();

import SibApiV3Sdk from "sib-api-v3-sdk";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const client = SibApiV3Sdk.ApiClient.instance;

    // Configure API key
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const emailData = {
      sender: {
        name: "FixIt Support",
        email: "fixit248@gmail.com", // any email works
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    };

    await apiInstance.sendTransacEmail(emailData);
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Email failed:", error.message);
  }
};
