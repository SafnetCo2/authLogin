import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, (req, res) => {
    const data = {
        users: 120,
        sales: 75,
        trending: [
            { title: "Product 1", count: 50 },
            { title: "Product 2", count: 40 },
            { title: "Product 3", count: 35 },
        ],
    };
    res.json({ data });
});

export default router;
