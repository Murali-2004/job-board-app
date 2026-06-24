import Job from "../models/Job.js";

// Create a new job
export const createJob = async (req, res) => {
  try {
    const {
      title,
      skills,
      description,
      company,
      location,
      salaryRange,
      jobType,
    } = req.body;
    const job = await Job.create({
      title,
      skills,
      description,
      company,
      location,
      salaryRange,
      jobType,
      postedBy: req.user._id,
    });
    return res.status(201).json({ message: "Job created successfully", job });
  } catch (error) {
    console.error("Create job error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get jobs by search query
export const getJobs = async (req, res) => {
  try {
    const { keyword, location, jobType, minSalary, maxSalary } = req.query;
    const query = {};
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const skip = (page - 1) * limit;

    console.log("KEYWORD 👉", keyword);

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { skills: { $regex: keyword, $options: "i" } },
        { company: { $regex: keyword, $options: "i" } },
      ];
    }
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    if (jobType) {
      query.jobType = { $regex: jobType, $options: "i" };
    }
    if (minSalary || maxSalary) {
      query.salaryRange = {};
      if (minSalary) {
        query.salaryRange.$gte = minSalary;
      }
      if (maxSalary) {
        query.salaryRange.$lte = maxSalary;
      }
    }
    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("postedBy", "name email");
    console.log("Jobs found 👉", jobs);
    const totalPages = Math.ceil(totalJobs / limit);

    return res.status(200).json({
      totalJobs,
      totalPages,
      currentPage: page,
      jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
