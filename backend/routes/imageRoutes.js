// routes/imageRoutes.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// GET /api/images?query=cars&page=2
router.get("/", async (req, res) => {
    const { query, page = 1 } = req.query;
    const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

    if (!query) {
        return res.status(400).json({ error: "Query is required" });
    }

    try {
        console.log(`🔎 Searching for: ${query}, page: ${page}`);

        const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
            query
        )}&per_page=8&page=${page}`;

        const response = await fetch(url, {
            headers: { Authorization: PEXELS_API_KEY },
        });

        if (!response.ok) {
            throw new Error(`Pexels API error: ${response.status}`);
        }

        const data = await response.json();

        let photos = data.photos;

        // fallback to "nature" if no results
        if (photos.length === 0 && query.toLowerCase() !== "nature") {
            console.log(`⚠️ No results for "${query}", falling back to "nature".`);

            const fallback = await fetch(
                `https://api.pexels.com/v1/search?query=nature&per_page=8&page=${page}`,
                { headers: { Authorization: PEXELS_API_KEY } }
            );

            if (!fallback.ok) {
                throw new Error(`Fallback Pexels API error: ${fallback.status}`);
            }

            const fallbackData = await fallback.json();
            photos = fallbackData.photos;
        }

        console.log(`✅ Images received: ${photos.length}`);

        // Normalize response
        const images = photos.map((p) => ({
            src: p.src,
            alt: p.alt || "Pexels Image",
            photographer: p.photographer,
        }));

        res.json({ images });
    } catch (error) {
        console.error("❌ Server error:", error.message);
        res.status(500).json({ error: "Failed to fetch images", details: error.message });
    }
});

export default router;
