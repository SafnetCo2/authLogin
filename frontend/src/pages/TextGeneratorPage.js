import React, { useState } from "react";

const TextGeneratorPage = () => {
    const [type, setType] = useState("blog");
    const [topic, setTopic] = useState("hotel services");
    const [generatedText, setGeneratedText] = useState("");
    const [loading, setLoading] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

    const handleGenerate = async () => {
        if (!topic) return;
        setLoading(true);
        setGeneratedText("");

        try {
            const res = await fetch(`${API_URL}/api/text`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, topic }),
            });

            if (!res.ok) throw new Error("Failed to generate text");
            const data = await res.json();
            setGeneratedText(data.text);
        } catch (err) {
            console.error(err);
            alert("Error generating text. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!generatedText) return;
        navigator.clipboard.writeText(generatedText).then(() => {
            alert("Text copied to clipboard!");
        });
    };

    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h2>📝 AI Text Generator (Demo)</h2>
            <p>Enter a topic and choose a type to generate random demo text.</p>

            <div style={{ marginBottom: "1rem" }}>
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. hotel services, travel tips"
                    style={{ padding: "0.5rem", marginRight: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                />

                <select value={type} onChange={(e) => setType(e.target.value)} style={{ padding: "0.5rem", borderRadius: "4px" }}>
                    <option value="blog">Blog</option>
                    <option value="social">Social Media</option>
                    <option value="description">Description</option>
                </select>

                <button
                    onClick={handleGenerate}
                    style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem", border: "none", borderRadius: "4px", background: "#007bff", color: "#fff", cursor: "pointer" }}
                >
                    Generate
                </button>
            </div>

            {loading && <p>Generating text...</p>}

            {generatedText && (
                <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
                    <p>{generatedText}</p>
                    <button
                        onClick={handleCopy}
                        style={{ marginTop: "0.5rem", padding: "0.3rem 0.8rem", border: "none", borderRadius: "4px", background: "#28a745", color: "#fff", cursor: "pointer" }}
                    >
                        📋 Copy Text
                    </button>
                </div>
            )}
        </div>
    );
};

export default TextGeneratorPage;
