import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../styles.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;
    const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

    // Manual login
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || "Login failed");

            localStorage.setItem("token", data.token); // ✅ Save JWT
            setSuccess(`Welcome ${data.user.name}!`);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    // Google login callback
    const handleGoogleCredential = useCallback(
        async (response) => {
            try {
                const res = await fetch(`${API_URL}/auth/google-login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ credential: response.credential }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.msg || "Google login failed");

                localStorage.setItem("token", data.token); // ✅ Save JWT
                setSuccess(`Welcome ${data.user.name}!`);
                navigate("/dashboard");
            } catch (err) {
                setError(err.message);
            }
        },
        [navigate, API_URL]
    );

    // Load Google script
    useEffect(() => {
        if (!GOOGLE_CLIENT_ID) return;

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: handleGoogleCredential,
                });
                window.google.accounts.id.renderButton(
                    document.getElementById("google-signin-button"),
                    { theme: "outline", size: "large" }
                );
            }
        };

        return () => document.body.removeChild(script);
    }, [GOOGLE_CLIENT_ID, handleGoogleCredential]);

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Login</h2>

                {error && <p className="auth-error">{error}</p>}
                {success && <p className="auth-success">{success}</p>}

                <form className="auth-form" onSubmit={handleLogin}>
                    <input
                        className="auth-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        className="auth-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="auth-button" type="submit">Login</button>
                </form>

                <div className="google-login-container">
                    <div id="google-signin-button"></div>
                </div>

                <div className="auth-toggle-link">
                    Don't have an account? <a href="/signup">Sign up</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
