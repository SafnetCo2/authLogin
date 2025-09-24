import React from "react";
import { useNavigate } from "react-router-dom";

const SuggestionsPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: "1rem" }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
                ← Back
            </button>
            <h2>AI Suggestions Page</h2>
            <p>List of AI suggestions will appear here.</p>
        </div>
    );
};

export default SuggestionsPage;
