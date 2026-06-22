import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  register,
  login,
  refreshAccessToken,
  logout,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// Register Route
router.post("/register", register);

// Login Route
router.post("/login", login);

// Refresh Token Route
router.post("/refresh", refreshAccessToken);

//logout route
router.post("/logout", protect, logout);

// test email route
router.post("/forgotPassword", protect, forgotPassword);

//verify reset password otp route
router.post("/verifyOTP", protect, verifyOTP);

// Additional routes for password reset can be added here
router.post("/resetPassword", protect, resetPassword);

export default router;
