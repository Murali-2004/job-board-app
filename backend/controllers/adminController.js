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

    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    const applicationByStatus = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json({
      totalUsers,
      totalJobs,
      totalApplications,
      latestUsers,
      latestJobs,
      latestApplications,
      usersByRole,
      applicationByStatus,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Admin controller to get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("name email role createdAt")
      .sort({ createdAt: -1 });
    return res.status(200).json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Admin controller to delete a user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    await User.findByIdAndDelete(req.params.userId);

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Admin controller to get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });
    return res.status(200).json(jobs);
  } catch (error) {
    console.error("Get all jobs error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Admin controller to delete a job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    await Job.findByIdAndDelete(req.params.jobId);

    return res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete job error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Admin controller to get job statistics
export const getJobStatistics = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();

    const fullTimeJobs = await Job.countDocuments({ jobType: "Full-time" });
    const partTimeJobs = await Job.countDocuments({ jobType: "Part-time" });
    const contractJobs = await Job.countDocuments({ jobType: "Contract" });
    const internshipJobs = await Job.countDocuments({ jobType: "Internship" });

    const jobsByLocation = await Job.aggregate([
      {
        $group: {
          _id: "$location",
          count: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json({
      totalJobs,
      fullTimeJobs,
      partTimeJobs,
      contractJobs,
      internshipJobs,
      jobsByLocation,
    });
  } catch (error) {
    console.error("Get job statistics error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
