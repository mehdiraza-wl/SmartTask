import { createTransport } from "nodemailer"
import 'dotenv/config';
// Create a transporter using SMTP
const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail(to:string, sub:string, message:string) {
try {
  const info = await transporter.sendMail({
    // from: '"Example Team" <team@example.com>', // sender address
    to, // list of recipients
    subject: sub, // subject line
    text: message, // plain text body
  });

  console.log("Message sent: %s", info.messageId);
} catch (err) {
  console.error("Error while sending mail:", err);
}


}