import Job from "../models/Job.js";
import Application from "../models/Application.js";

// get recruiter profile data
export const getRecruiterProfile = async (req, res) => {
  try {
    const jobs = await Job.find({
      postedBy: req.user._id,
    });

    const jobIds = jobs.map((job) => job._id);

    const totalJobs = jobs.length;

    const totalApplications = await Application.countDocuments({
      job: { $in: jobIds },
    });

    const statusStats = await Application.aggregate([
      {
        $match: {
          job: { $in: jobIds },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const dashboardStats = {
      applied: 0,
      underReview: 0,
      accepted: 0,
      rejected: 0,
    };

    statusStats.forEach((item) => {
      switch (item._id) {
        case "Applied":
          dashboardStats.applied = item.count;
          break;

        case "Under Review":
          dashboardStats.underReview = item.count;
          break;

        case "Accepted":
          dashboardStats.accepted = item.count;
          break;

        case "Rejected":
          dashboardStats.rejected = item.count;
          break;
      }
    });

    return res.status(200).json({
      totalJobs,
      totalApplications,
      ...dashboardStats,
    });
  } catch (error) {
    console.error("Get recruiter dashboard error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Get jobs posted by the recruiter
export const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id });
    return res.status(200).json({
      totalJobs: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get recruiter jobs error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

//delete job posted by the recruiter
export const deleteRecruiterJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this job" });
    }
    await job.deleteOne();
    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete recruiter job error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Update job posted by the recruiter
export const updateRecruiterJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this job" });
    }
    const allowedFields = [
      "title",
      "skills",
      "description",
      "company",
      "location",
      "salaryRange",
      "jobType",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    await job.save();
    return res.status(200).json({ message: "Job updated successfully", job });
  } catch (error) {
    console.error("Update recruiter job error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
