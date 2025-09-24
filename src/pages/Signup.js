import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const API_URL = process.env.REACT_APP_API_URL;

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            alert("Please fill all fields");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (res.status !== 200) {
                alert(data.msg || "Signup failed");
                return;
            }

            // ✅ Save token & user info
            localStorage.setItem("token", data.token);
            localStorage.setItem("userName", data.user.name);

            navigate("/dashboard");
        } catch (err) {
            console.error("Signup error:", err);
        }
    };

    return (
        <form onSubmit={handleSignup}>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Signup</button>
        </form>
    );
};

export default Signup;
