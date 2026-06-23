import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { getAdminDashboard } from "../controllers/adminController.js";

const router = express.Router();

// Admin dashboard route
router.get("/dashboard", protect, authorizeRoles("admin"), getAdminDashboard);

export default router;
