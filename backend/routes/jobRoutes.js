import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  saveJobToProfile,
  removeSavedJobFromProfile,
  viewSavedJobs,
} from "../controllers/userController.js";
import { createJob, getJobs } from "../controllers/jobController.js";

const router = express.Router();

// Create a new job (recruiter only)
router.post("/create", protect, authorizeRoles("recruiter"), createJob);

// all jobs
router.get("/", protect, getJobs);

// Save job to user profile
router.post("/:jobId/save", protect, saveJobToProfile);

// Remove saved job from user profile
router.delete("/:jobId/remove", protect, removeSavedJobFromProfile);

// View saved jobs from user profile
router.get("/saved", protect, viewSavedJobs);

export default router;
