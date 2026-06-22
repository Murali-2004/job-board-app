import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create a transporter using your email service credentials
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS ? "EMAIL PASS FOUND" : "EMAIL PASS MISSING");

export default transporter;
