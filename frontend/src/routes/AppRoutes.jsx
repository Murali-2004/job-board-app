import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import Home from "../pages/shared/Home";
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import Unauthorized from "../pages/Unauthorized";
import Users from "../pages/admin/Users"
import Dashboard from "../pages/admin/Dashboard";
import AdminJobs from "../pages/admin/Jobs";
import JobDetails from "../pages/shared/JobDetails";
import Jobs from "../pages/shared/Jobs";
import Application from "../pages/jobseeker/Applications";
import JobseekerDashboard from "../pages/jobseeker/Dashboard"
import SavedJobs from "../pages/jobseeker/SavedJobs"
import CreateJob from "../pages/recruiter/CreateJob";
import RecruiterDashboard from "../pages/recruiter/Dashboard"
import ManageJobs from "../pages/recruiter/ManageJobs";

const AppRoutes = () => {
    return (
        <Routes>

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Shared Routes */}
            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/jobdetails"
                element={
                    <ProtectedRoute >
                        <JobDetails />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/jobs"
                element={
                    <ProtectedRoute >
                        <Jobs />
                    </ProtectedRoute>
                }
            />


            {/* Jobseeker Routes */}
            <Route
                path="/jobseeker/applications"
                element={
                    <RoleProtectedRoute allowedRoles={["jobseeker"]}>
                        <Application />
                    </RoleProtectedRoute>
                }
            />
            <Route
                path="/jobseeker/dashboard"
                element={
                    <RoleProtectedRoute allowedRoles={["jobseeker"]}>
                        <JobseekerDashboard />
                    </RoleProtectedRoute>
                }
            />
            <Route
                path="/jobseeker/savedjobs"
                element={
                    <RoleProtectedRoute allowedRoles={["jobseeker"]}>
                        <SavedJobs />
                    </RoleProtectedRoute>
                }
            />

            {/* Recruiter Routes */}
            <Route
                path="/recruiter/createjob"
                element={
                    <RoleProtectedRoute allowedRoles={["recruiter"]}>
                        <CreateJob />
                    </RoleProtectedRoute>
                }
            />
            <Route
                path="/recruiter/dashboard"
                element={
                    <RoleProtectedRoute allowedRoles={["recruiter"]}>
                        <RecruiterDashboard />
                    </RoleProtectedRoute>
                }
            />
            <Route
                path="/recruiter/managejobs"
                element={
                    <RoleProtectedRoute allowedRoles={["recruiter"]}>
                        <ManageJobs />
                    </RoleProtectedRoute>
                }
            />

            {/* admin routes */}
            <Route
                path="/admin/dashboard"
                element={
                    <RoleProtectedRoute allowedRoles={["admin"]}>
                        <Dashboard />
                    </RoleProtectedRoute>
                }
            />
            <Route
                path="/admin/jobs"
                element={
                    <RoleProtectedRoute allowedRoles={["admin"]}>
                        <AdminJobs />
                    </RoleProtectedRoute>
                }
            />
            <Route
                path="/admin/users"
                element={
                    <RoleProtectedRoute allowedRoles={["admin"]}>
                        <Users />
                    </RoleProtectedRoute>
                }
            />
            <Route
                path="/unauthorized"
                element={<Unauthorized />}
            />
        </Routes>
    );
};

export default AppRoutes;