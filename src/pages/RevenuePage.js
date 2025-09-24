import React from "react";
import { useNavigate } from "react-router-dom";

const RevenuePage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: "1rem" }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
                ← Back
            </button>
            <h2>Revenue Page</h2>
            <p>Revenue details and charts will appear here.</p>
        </div>
    );
};

export default RevenuePage;
