import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  applyForJob,
  getUserApplications,
  getJobApplications,
  updateApplicationStatus,
  getApplicationById,
} from "../controllers/applicationController.js";

const router = express.Router();

// Apply for a job (applicant only)
router.post("/apply/:jobId", protect, authorizeRoles("jobseeker"), applyForJob);

// Get my applications (applicant only)
router.get(
  "/my-applications",
  protect,
  authorizeRoles("jobseeker"),
  getUserApplications,
);

// Get received applications (recruiter only)
router.get(
  "/receivedApplications",
  protect,
  authorizeRoles("recruiter"),
  getJobApplications,
);

// Update application status (recruiter only)
router.put(
  "/updateApplicationStatus/:applicationId",
  protect,
  authorizeRoles("recruiter"),
  updateApplicationStatus,
);

// Get application by ID (recruiter only)
router.get(
  "/:applicationId",
  protect,
  authorizeRoles("recruiter"),
  getApplicationById,
);

export default router;
