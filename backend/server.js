import dotenv from "dotenv";
dotenv.config();


import express from "express";
import mongoose from "mongoose";

import cors from "cors";
import session from "express-session";
import passport from "passport";
import imageRoutes from "./routes/imageRoutes.js"
import textRoutes from "./routes/textRoutes.js";

import authRoutes from "./routes/auth.js";
import chatbotRoutes from "./routes/chatbot.js";



const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/api/text", textRoutes);

app.use("/chatbot", chatbotRoutes);
app.use("/api/images", imageRoutes);
console.log("🔑 PEXELS_API_KEY:", process.env.PEXELS_API_KEY);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
