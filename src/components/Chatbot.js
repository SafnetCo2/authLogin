import React, { useState, useEffect, useRef } from "react";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const chatboxRef = useRef(null);

    const API_URL = process.env.REACT_APP_API_URL;

    // Get token from localStorage
    const token = localStorage.getItem("token");

    useEffect(() => {
        chatboxRef.current?.scrollTo(0, chatboxRef.current.scrollHeight);
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        if (!token) {
            alert("You are not logged in. Please login first.");
            return;
        }

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);

        try {
            const res = await fetch(`${API_URL}/chatbot`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // ✅ must include "Bearer "
                },
                body: JSON.stringify({ message: input }),
            });

            const data = await res.json();

            if (res.status !== 200) {
                console.error("Chatbot error:", data.msg);
                setMessages((prev) => [
                    ...prev,
                    { role: "bot", content: "Sorry, something went wrong." },
                ]);
            } else {
                const botMessage = { role: "bot", content: data.reply };
                setMessages((prev) => [...prev, botMessage]);
            }

            setInput("");
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <div className="chatbot-section">
            <h3>AI Chatbot</h3>
            <div className="chatbox" ref={chatboxRef}>
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        style={{
                            textAlign: msg.role === "user" ? "right" : "left",
                            margin: "0.5rem 0",
                        }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                padding: "0.5rem 1rem",
                                borderRadius: "12px",
                                background: msg.role === "user" ? "#d1e7dd" : "#f1f1f1",
                            }}
                        >
                            {msg.content}
                        </span>
                    </div>
                ))}
            </div>
            <div className="chat-input-container">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chatbot;
