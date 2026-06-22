import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

// controller to upload resume to cloudinary and save the URL in user profile
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "resumes",
            resource_type: "raw",
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          },
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload();

    const user = await User.findById(req.user._id);

    user.resume = result.secure_url;

    await user.save();

    return res.status(200).json({
      message: "Resume uploaded successfully",
      resumeUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Resume upload error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// New controller function to get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Get user profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//controller to update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields based on request body
    Object.assign(user, req.body);

    await user.save();

    return res.status(200).json({
      message: "User profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//controller to save job to user profile
export const saveJobToProfile = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({ message: "Job already saved" });
    }

    //user.savedJobs = [...user.savedJobs, jobId];
    // instead of this line we use push method to update user.savedJobs
    user.savedJobs.push(jobId);
    await user.save();

    return res.status(200).json({
      message: "Job saved to profile successfully",
      user,
    });
  } catch (error) {
    console.error("Save job to profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//controller to remove saved job from user profile
export const removeSavedJobFromProfile = async (req, res) => {
  try {
    const { jobId } = req.params;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (!user.savedJobs.includes(jobId)) {
      return res.status(400).json({ message: "Job not saved" });
    }

    // remove jobId from savedJobs using Mongoose array pull
    user.savedJobs.pull(jobId);
    await user.save();

    return res.status(200).json({
      message: "Job removed from profile successfully",
      user,
    });
  } catch (error) {
    console.error("Remove saved job from profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//view saved jobs from user profile
export const viewSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("savedJobs");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "Saved jobs retrieved successfully",
      savedJobs: user.savedJobs,
    });
  } catch (error) {
    console.error("View saved jobs error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//controller to view user applications dashboard
export const viewUserApplications = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const applications = await Application.find({ applicant: user._id });
    const applicationIds = applications.map((app) => app._id);
    const totalApplications = applications.length;

    const dashboardStats = {
      totalApplications,
      applicationStatusCounts: {
        applied: applications.filter((app) => app.status === "Applied").length,
        UnderReview: applications.filter((app) => app.status === "Under Review")
          .length,
        accepted: applications.filter((app) => app.status === "Accepted")
          .length,
        rejected: applications.filter((app) => app.status === "Rejected")
          .length,
      },
    };

    return res.status(200).json({
      message: "User applications retrieved successfully",
      dashboardStats,
    });
  } catch (error) {
    console.error("View user applications error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
