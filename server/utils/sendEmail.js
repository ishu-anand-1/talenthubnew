import nodemailer from "nodemailer";

/* ===================== ENV VALIDATION ===================== */
if (
  !process.env.EMAIL_HOST ||
  !process.env.EMAIL_PORT ||
  !process.env.EMAIL_USER ||
  !process.env.EMAIL_PASS
) {
  throw new Error("❌ Email environment variables are missing");
}

/* ===================== TRANSPORTER ===================== */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465, // true for 465, false for others
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ===================== VERIFY CONNECTION (OPTIONAL) ===================== */
transporter.verify((error) => {
  if (error) {
    console.error("❌ Email server connection failed:", error.message);
  } else {
    console.log("📧 Email server is ready");
  }
});

/* ===================== SEND EMAIL ===================== */
const sendEmail = async ({ to, subject, text, html }) => {
  if (!to || !subject || (!text && !html)) {
    throw new Error("❌ Missing required email fields");
  }

  try {
    await transporter.sendMail({
      from: `"TalentHub" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    throw new Error("Email sending failed");
  }
};

export default sendEmail;
