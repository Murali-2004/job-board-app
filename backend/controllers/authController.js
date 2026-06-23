import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/email.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";

// User Registration
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (!role || !["jobseeker", "recruiter"].includes(role)) {
      return res.status(400).json({
        message: "Role must be either jobseeker or recruiter",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (user.isBlocked) {
      return res.status(403).json({
        message: "Your account has been blocked by admin",
      });
    }

    const accessToken = generateAccessToken(user._id, user.tokenVersion);

    const refreshToken = generateRefreshToken(user._id, user.tokenVersion);

    user.refreshToken = refreshToken;
    await user.save();
    res
      .status(200)
      .json({ message: "Login successful", accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Refresh Token
export const refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user._id, user.tokenVersion);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

//logout
export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.refreshToken = null;
    await user.save();
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Forgot Password

//step 1: User requests password reset by providing their email and server sends an email with a reset link or OTP (One-Time Password) to the user's email address. The OTP is stored in the database with an expiration time.
//nodemailer is used to send the email with the reset link
export const forgotPassword = async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Generate a random OTP (One-Time Password)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // save otp in user document with an expiration time (e.g., 10 minutes)
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpire = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    user.otpVerified = false;
    await user.save();

    // Send the OTP to the user's emails
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email, // user's email
      subject: "Reset Password OTP",
      text: `Your OTP for password reset is: ${otp}`,
    });

    res.status(200).json({
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Email failed",
    });
  }
};

//step 2: User submits the OTP along with their new password to the server. The server verifies the OTP and updates the user's password if the OTP is valid and not expired.
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (user.resetPasswordOTPExpire < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }
    user.otpVerified = true;
    await user.save();
    return res
      .status(200)
      .json({ message: "OTP verified, you can now reset your password" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error through verify OTP" });
  }
};

//step 3: User resets their password by providing the new password along with the OTP. The server verifies the OTP again and updates the user's password if the OTP is valid and not expired.
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.otpVerified) {
      return res.status(400).json({ message: "OTP not verified" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.refreshToken = null; // Invalidate existing refresh tokens
    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpire = null;
    user.otpVerified = false;
    user.tokenVersion += 1;
    await user.save();
    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error through reset password" });
  }
};
