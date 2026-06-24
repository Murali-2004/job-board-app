import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  getRecruiterProfile,
  getRecruiterJobs,
  deleteRecruiterJob,
  updateRecruiterJob,
} from "../controllers/recruiterController.js";

const router = express.Router();

// ROute for getting recruiter profile data
router.get(
  "/profile",
  protect,
  authorizeRoles("recruiter"),
  getRecruiterProfile,
);

// Route for getting jobs posted by the recruiter
router.get(
  "/getRecruiterJobs",
  protect,
  authorizeRoles("recruiter"),
  getRecruiterJobs,
);

// Route for deleting a job posted by the recruiter
router.delete(
  "/jobs/:jobId",
  protect,
  authorizeRoles("recruiter"),
  deleteRecruiterJob,
);

// Route for updating a job posted by the recruiter
router.put(
  "/jobs/:jobId",
  protect,
  authorizeRoles("recruiter"),
  updateRecruiterJob,
);

export default router;
