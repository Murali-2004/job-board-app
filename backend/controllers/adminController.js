import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

// Admin dashboard controller
export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRecruiters = await User.countDocuments({ role: "recruiter" });
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    return res.status(200).json({
      totalUsers,
      totalRecruiters,
      totalJobs,
      totalApplications,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
