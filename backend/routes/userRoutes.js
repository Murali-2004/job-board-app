import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  uploadResume,
  getUserProfile,
  updateUserProfile,
  viewUserApplications,
} from "../controllers/userController.js";

const router = express.Router();

// Route for uploading resumes
router.post("/upload-resume", protect, upload.single("resume"), uploadResume);

// Route for getting user profile
router.get("/profile", protect, getUserProfile);

// Route for updating user profile
router.put("/Update-profile", protect, updateUserProfile);

// Route for getting user applications dashboard data
router.get(
  "/applications",
  protect,
  authorizeRoles("jobseeker"),
  viewUserApplications,
);

export default router;
