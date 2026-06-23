import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

// Admin dashboard controller
export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    const latestUsers = await User.find()
      .select("name email role createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    const latestJobs = await Job.find()
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    const latestApplications = await Application.find()
      .populate("applicant", "name email")
      .populate("job", "title company")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      totalUsers,
      totalJobs,
      totalApplications,
      latestUsers,
      latestJobs,
      latestApplications,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
