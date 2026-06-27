import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import {
    guestLinks,
    jobSeekerLinks,
    recruiterLinks,
    adminLinks,
} from "../constants/navLinks";

const Navbar = () => {
    const { user, logout } = useAuth();

    const roleLinks = {
        jobseeker: jobSeekerLinks,
        recruiter: recruiterLinks,
        admin: adminLinks,
    };

    const links = user
        ? roleLinks[user.role]
        : guestLinks;
    return (
        <nav>
            <h2>Job Board</h2>

            {links.map((link) => (
                <Link
                    key={link.path}
                    to={link.path}
                    style={{ marginRight: "15px" }}
                >
                    {link.name}
                </Link>
            ))}

            {user && (
                <>
                    <span style={{ marginLeft: "20px" }}>
                        Welcome, {user.name}
                    </span>

                    <button
                        onClick={logout}
                        style={{ marginLeft: "10px" }}
                    >
                        Logout
                    </button>
                </>
            )}
        </nav>
    );
};

export default Navbar;