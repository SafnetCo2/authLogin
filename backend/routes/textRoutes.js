// routes/textRoutes.js
import express from "express";

const router = express.Router();

// Simple random text generator
const sampleTexts = {
    blog: [
        "Discover the best hotel services to make your stay unforgettable.",
        "Learn how to improve your business with top-notch hospitality tips.",
        "Explore the ultimate guide to choosing the perfect hotel for your vacation.",
    ],
    social: [
        "Check out our amazing hotel deals! 🏨✨",
        "Your dream vacation starts here! #TravelGoals",
        "Relax, unwind, and enjoy the luxury you deserve.",
    ],
    description: [
        "A cozy hotel room with modern amenities and free Wi-Fi.",
        "Enjoy a peaceful stay with a beautiful city view and complimentary breakfast.",
        "Spacious suites with elegant decor and 24/7 service.",
    ],
};

// POST /api/text
router.post("/", (req, res) => {
    const { type = "blog", topic = "hotel services" } = req.body;

    // Pick a random text from the type array
    const texts = sampleTexts[type] || sampleTexts.blog;
    const text = texts[Math.floor(Math.random() * texts.length)];

    res.json({ text });
});

export default router;
