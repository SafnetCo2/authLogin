import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const Register = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Registered successfully!");
                setTimeout(() => navigate("/"), 1500);
            } else {
                setMessage(data.message);
            }
        } catch (err) {
            setMessage("Error registering");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Register</h2>
                <form className="auth-form" onSubmit={handleRegister}>
                    <input
                        className="auth-input"
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        className="auth-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="auth-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="auth-button" type="submit">
                        Register
                    </button>
                </form>

                {message && <p className="auth-success">{message}</p>}

                <div className="auth-toggle-link">
                    <p>
                        Already have an account? <a href="/">Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
