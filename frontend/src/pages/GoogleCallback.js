import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const GoogleCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token); // ✅ Save JWT
            navigate("/dashboard");
        } else {
            navigate("/login");
        }
    }, [location, navigate]);

    return <p>Logging in...</p>;
};

export default GoogleCallback;
