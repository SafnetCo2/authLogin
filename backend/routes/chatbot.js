import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import ChatMessage from "../models/ChatMessage.js";
import OpenAI from "openai";

const router = express.Router();

// Initialize OpenAI if API key exists
let openai = null;
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// In-memory conversation memory per user
const conversationMemory = {};

// Simulated dashboard stats
const dashboardStats = {
    totalUsers: 1245,
    activeChats: 324,
    revenue: "$15,430",
};

// Rule-based responses
const responseOptions = {
    greeting: (name) => [
        `Hi ${name}! How can I assist you today?`,
        `Hello ${name}! What can I do for you?`,
        `Hey ${name}! Need any help?`,
    ],
    help: [
        "Sure! I am here to assist you. What do you need help with?",
        "I can help you with any questions or guidance you need.",
    ],
    thanks: [
        "You’re welcome! Glad I could help.",
        "No problem! Happy to assist.",
        "Anytime! 🙂",
    ],
    price: [
        "Our pricing details are available on the dashboard under 'Services'.",
        "You can check our service costs on the dashboard.",
    ],
    services: [
        "We offer AI assistance, analytics, and more.",
        "Our services include AI tools, reporting, and dashboards.",
    ],
    contact: [
        "You can contact support via email at support@example.com.",
        "Reach us at support@example.com for assistance.",
    ],
    about: [
        "We are an AI-focused company providing intelligent solutions for businesses.",
        "Our company specializes in AI-powered solutions for enterprises.",
    ],
    goodbye: [
        "Goodbye! Have a wonderful day!",
        "See you later! Take care!",
        "Bye! Come back soon!",
    ],
    smallTalk: [
        "I’m doing great! How about you?",
        "I’m just a bot, but I’m here to help you!",
        "I love chatting with users like you!",
        "Why did the scarecrow win an award? Because he was outstanding in his field! 😄",
    ],
    stats: (key) => [
        `The current ${key} is ${dashboardStats[key]}.`,
        `${key.replace(/([A-Z])/g, " $1")} stands at ${dashboardStats[key]}.`,
    ],
    unknown: [
        "Sorry, I don't understand that. Can you rephrase?",
        "I’m not sure about that. Could you ask differently?",
    ],
};

// Helper: pick a random response
const randomResponse = (options, name = "") => {
    const arr = typeof options === "function" ? options(name) : options;
    return arr[Math.floor(Math.random() * arr.length)];
};

// Rule-based reply
const getRuleBasedReply = (message, name) => {
    const msg = message.toLowerCase();

    if (msg.includes("hello") || msg.includes("hi")) return randomResponse(responseOptions.greeting, name);
    if (msg.includes("help")) return randomResponse(responseOptions.help);
    if (msg.includes("thanks") || msg.includes("thank you")) return randomResponse(responseOptions.thanks);
    if (msg.includes("price") || msg.includes("cost")) return randomResponse(responseOptions.price);
    if (msg.includes("services") || msg.includes("offer")) return randomResponse(responseOptions.services);
    if (msg.includes("contact") || msg.includes("support")) return randomResponse(responseOptions.contact);
    if (msg.includes("about") || msg.includes("company")) return randomResponse(responseOptions.about);
    if (msg.includes("bye") || msg.includes("goodbye")) return randomResponse(responseOptions.goodbye);
    if (
        msg.includes("how are you") ||
        msg.includes("your name") ||
        msg.includes("joke") ||
        msg.includes("favorite")
    ) return randomResponse(responseOptions.smallTalk);
    if (msg.includes("total users")) return randomResponse(responseOptions.stats("totalUsers"));
    if (msg.includes("active chats")) return randomResponse(responseOptions.stats("activeChats"));
    if (msg.includes("revenue")) return randomResponse(responseOptions.stats("revenue"));

    return randomResponse(responseOptions.unknown);
};

// POST /chatbot
router.post("/", verifyToken, async (req, res) => {
    const { message } = req.body;
    const userId = req.user?.id;
    const userName = req.user?.name || "User";

    if (!message?.trim()) return res.status(400).json({ msg: "Message cannot be empty" });
    if (!userId) return res.status(401).json({ msg: "Unauthorized: No valid user" });

    try {
        // Initialize memory
        if (!conversationMemory[userId]) conversationMemory[userId] = [];
        conversationMemory[userId].push({ role: "user", content: message });
        if (conversationMemory[userId].length > 5) conversationMemory[userId] = conversationMemory[userId].slice(-5);

        // Generate reply
        let reply;
        if (openai) {
            try {
                const response = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: conversationMemory[userId],
                });
                reply = response.choices?.[0]?.message?.content || getRuleBasedReply(message, userName);
            } catch {
                // Quiet fallback to random rule-based reply
                reply = getRuleBasedReply(message, userName);
            }
        } else {
            reply = getRuleBasedReply(message, userName);
        }

        conversationMemory[userId].push({ role: "bot", content: reply });

        // Save to MongoDB
        await ChatMessage.create({ userId, userName, message, response: reply });

        res.json({ reply });
    } catch (err) {
        console.error("Chatbot route error:", err.message);
        res.status(500).json({ msg: "Internal server error" });
    }
});

export default router;
