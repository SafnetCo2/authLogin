import React, { useState } from "react";

const ImageGeneratorPage = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState("nature");

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

    const handleGenerate = async () => {
        if (!query) return;
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/images?query=${query}`);
            if (!res.ok) throw new Error("Failed to fetch images");
            const data = await res.json();
            setImages(data.images || []); // ✅ matches backend format
        } catch (err) {
            console.error(err);
            alert("Error fetching images. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (url, idx) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = `pexels-image-${idx + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h2>🖼️ AI Image Generator (via Backend)</h2>
            <p>Enter a keyword and fetch real images securely from Pexels.</p>

            <div style={{ marginBottom: "1rem" }}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. car, hotel, beach"
                    style={{
                        padding: "0.5rem",
                        marginRight: "0.5rem",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                    }}
                />
                <button
                    onClick={handleGenerate}
                    style={{
                        padding: "0.5rem 1rem",
                        border: "none",
                        borderRadius: "4px",
                        background: "#007bff",
                        color: "#fff",
                        cursor: "pointer",
                    }}
                >
                    Generate Images
                </button>
            </div>

            {loading && <p>Loading images...</p>}

            <div
                style={{
                    marginTop: "2rem",
                    display: "flex",
                    gap: "1rem",
                    flexWrap: "wrap",
                    justifyContent: "center",
                }}
            >
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "0.5rem",
                            border: "1px solid #eee",
                            padding: "0.8rem",
                            borderRadius: "8px",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        }}
                    >
                        <img
                            src={img.src.medium}
                            alt={img.alt}
                            style={{
                                width: "250px",
                                height: "200px",
                                objectFit: "cover",
                                borderRadius: "8px",
                            }}
                        />
                        <small style={{ fontSize: "0.9rem", color: "#555" }}>
                            📸 {img.photographer}
                        </small>
                        <button
                            onClick={() => handleDownload(img.src.original, idx)}
                            style={{
                                padding: "0.3rem 0.8rem",
                                border: "none",
                                borderRadius: "4px",
                                background: "#28a745",
                                color: "#fff",
                                cursor: "pointer",
                            }}
                        >
                            ⬇ Download
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageGeneratorPage;
