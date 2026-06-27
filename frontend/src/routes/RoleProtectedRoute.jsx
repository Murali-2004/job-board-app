import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RoleProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    // Not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Wrong role
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Allowed
    return children;
};

export default RoleProtectedRoute;