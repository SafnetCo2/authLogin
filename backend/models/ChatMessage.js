import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    message: { type: String, required: true },
    response: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ChatMessage", chatMessageSchema);
