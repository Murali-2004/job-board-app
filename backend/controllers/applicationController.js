import Application from "../models/Application.js";
import Job from "../models/Job.js";
import transporter from "../config/email.js";

// Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const applicantId = req.user._id;

    // Check if the user has already applied for this job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: applicantId,
    });
    if (existingApplication) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job" });
    }

    const application = await Application.create({
      job: jobId,
      applicant: applicantId,
    });

    return res
      .status(201)
      .json({ message: "Application submitted successfully", application });
  } catch (error) {
    console.error("Apply for job error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get My all applications
export const getUserApplications = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const applicantId = req.user._id;
    const applications = await Application.find({
      applicant: applicantId,
    })
      .populate("job", "title company location")
      .skip(skip)
      .limit(limit);
    if (!applications) {
      return res.status(400).json({ message: "Application Not Found" });
    }

    const totalApplications = await Application.countDocuments({
      applicant: applicantId,
    });
    const totalPages = Math.ceil(totalApplications / limit);
    return res.status(200).json({
      TotalPages: totalPages,
      CurrentPage: page,
      TotalApplications: totalApplications,
      applications,
    });
  } catch (error) {
    console.error("Get user applications error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get received applications (for Recruiter)
export const getJobApplications = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const jobs = await Job.find({ postedBy: req.user._id });
    if (!jobs || jobs.length === 0) {
      return res
        .status(404)
        .json({ message: "No jobs found for this Recruiter" });
    }
    const jobIds = jobs.map((job) => job._id);
    const applications = await Application.find({
      job: { $in: jobIds },
    })
      .populate("applicant", "name email resume")
      .populate("job", "title company")
      .skip(skip)
      .limit(limit);

    const totalReceivedApplication = await applications.length;
    const totalPages = Math.ceil(totalReceivedApplication / limit);

    return res.status(200).json({
      TotalPages: totalPages,
      CurrentPage: page,
      TotalReceivedApplicant: totalReceivedApplication,
      Applications: applications,
    });
  } catch (error) {
    console.error("Get job applications error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update application status (by recruiter)
export const updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    const { status } = req.body;

    const application = await Application.findById(applicationId)
      .populate("job")
      .populate("applicant", "name email");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Access denied, you are not the owner of this job" });
    }

    application.status = status;
    await application.save();
    if (status === "Accepted" || status === "Rejected") {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: application.applicant.email,
          subject: `Application Status Update for ${application.job.title}`,
          text: `Hello ${application.applicant.name},

Your application for the position of ${application.job.title} at ${application.job.company} has been updated to: ${status}.

Best regards,
${application.job.company}`,
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // return res.status(500).json({ message: "Email sending failed" });
      }
    }

    return res.status(200).json({
      message: "Application status updated and email sent successfully",
      application,
    });
  } catch (error) {
    console.error("Update application status error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get application by ID (by recruiters)
export const getApplicationById = async (req, res) => {
  try {
    const applicationId = req.params.applicationId;

    const application = await Application.findById(applicationId)
      .populate("applicant", "name email resume")
      .populate("job", "title company location postedBy");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Access denied, you are not the owner of this job" });
    }
    if (application.status === "Applied") {
      application.status = "Under Review";
      await application.save();
    }
    return res.status(200).json(application);
  } catch (error) {
    console.error("Get application by ID error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
