import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Make sure you have a User model
import { OAuth2Client } from "google-auth-library";
import { verifyToken } from "../middleware/authMiddleware.js";
import ChatMessage from "../models/ChatMessage.js";
import OpenAI from "openai";

const router = express.Router();

// ---------------------
// Initialize OpenAI
// ---------------------
const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

// ---------------------
// Google OAuth client
// ---------------------
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// In-memory conversation memory per user
const conversationMemory = {};

// ---------------------
// GOOGLE LOGIN
// ---------------------
router.post("/google-login", async (req, res) => {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ msg: "No credential provided" });

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, sub: googleId } = payload;

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ email, name, googleId, password: null });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        );

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.error("Google login error:", err);
        res.status(500).json({ msg: "Google login failed" });
    }
});

// ---------------------
// MANUAL LOGIN
// ---------------------
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Email and password required" });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "User not found" });
        if (!user.password) return res.status(400).json({ msg: "Use Google login for this account" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Incorrect password" });

        const token = jwt.sign(
            { id: user._id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        );

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ msg: "Login failed" });
    }
});

// ---------------------
// CHATBOT ROUTE
// ---------------------
router.post("/chatbot", verifyToken, async (req, res) => {
    const { message } = req.body;
    const userId = req.user?.id;
    const userName = req.user?.name || "User";

    if (!message || message.trim() === "") return res.status(400).json({ msg: "Message cannot be empty" });

    try {
        if (!conversationMemory[userId]) conversationMemory[userId] = [];
        conversationMemory[userId].push({ role: "user", content: message });
        if (conversationMemory[userId].length > 5) {
            conversationMemory[userId] = conversationMemory[userId].slice(-5);
        }

        let reply = "OpenAI API key not configured.";
        if (openai) {
            try {
                const response = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: conversationMemory[userId],
                });
                reply = response.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
            } catch (err) {
                console.error("OpenAI error, fallback to default reply:", err);
                reply = "Sorry, I couldn't generate a response.";
            }
        }

        conversationMemory[userId].push({ role: "bot", content: reply });
        await ChatMessage.create({ userId, userName, message, response: reply });

        res.json({ reply });
    } catch (err) {
        console.error("Chatbot error:", err);
        res.status(500).json({ msg: "Internal server error" });
    }
});

export default router;
