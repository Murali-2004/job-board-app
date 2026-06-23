import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  getAdminDashboard,
  getAllUsers,
  deleteUser,
  getAllJobs,
  deleteJob,
  getJobStatistics,
  blockUser,
  unblockUser,
  searchUsers,
  searchJobs,
} from "../controllers/adminController.js";

const router = express.Router();

// Admin dashboard route
router.get("/dashboard", protect, authorizeRoles("admin"), getAdminDashboard);

// route for get all users(admin only)
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

// route for delete user(admin only)
router.delete("/users/:userId", protect, authorizeRoles("admin"), deleteUser);

// route for get all jobs(admin only)
router.get("/jobs", protect, authorizeRoles("admin"), getAllJobs);

//route for delete job(admin only)
router.delete("/jobs/:jobId", protect, authorizeRoles("admin"), deleteJob);

// route for get job statistics(admin only)
router.get(
  "/job-statistics",
  protect,
  authorizeRoles("admin"),
  getJobStatistics,
);

// route for to block and unblock user by admin
router.put("/users/:userId/block", protect, authorizeRoles("admin"), blockUser);
router.put(
  "/users/:userId/unblock",
  protect,
  authorizeRoles("admin"),
  unblockUser,
);

// route for get user by search
router.get("/users/search", protect, authorizeRoles("admin"), searchUsers);

// route for get job by search
router.get("/jobs/search", protect, authorizeRoles("admin"), searchJobs);

export default router;
