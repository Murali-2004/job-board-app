import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/recruiter", protect, authorizeRoles("recruiter"), (req, res) => {
  res.json({ message: "Recruiter access granted", user: req.user });
});

router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Admin access granted", user: req.user });
});

router.get("/jobseeker", protect, authorizeRoles("jobseeker"), (req, res) => {
  res.json({ message: "Job seeker access granted", user: req.user });
});

export default router;
