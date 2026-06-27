import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "jobseeker",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            setLoading(true);

            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            };

            const response = await API.post("/auth/register", payload);

            alert(response.data.message);

            navigate("/login");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }


    };

    return (<div> <h2>Register</h2>

        {error && <p>{error}</p>}

        <form onSubmit={handleSubmit}>
            <div>
                <label>Name</label>
                <br />
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <br />

            <div>
                <label>Email</label>
                <br />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <br />

            <div>
                <label>Password</label>
                <br />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>

            <br />

            <div>
                <label>Confirm Password</label>
                <br />
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
            </div>

            <br />

            <div>
                <label>Role</label>
                <br />
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                >
                    <option value="jobseeker">
                        Job Seeker
                    </option>

                    <option value="recruiter">
                        Recruiter
                    </option>
                </select>
            </div>

            <br />

            <button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
            </button>
        </form>

        <br />

        <p>
            Already have an account?{" "}
            <Link to="/login">Login</Link>
        </p>
    </div>

    );
};

export default Register;
