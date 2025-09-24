import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import {
    FaTachometerAlt,
    FaChartLine,
    FaRobot,
    FaSignOutAlt,
    FaUsers,
    FaBars,
    FaTimes
} from "react-icons/fa";
import Chatbot from "../components/Chatbot";
import ChartComponent from "../components/ChartComponent";

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("dashboard");
    const [analyticsData, setAnalyticsData] = useState(null);
    const navigate = useNavigate();

    const handleToggle = () => setSidebarOpen(!sidebarOpen);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const sections = [
        { key: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
        { key: "analytics", label: "Analytics", icon: <FaChartLine /> },
        { key: "chatbot", label: "Chatbot", icon: <FaRobot /> },
        { key: "tools", label: "AI Tools", icon: <FaUsers />, badge: "AI" },
    ];

    useEffect(() => {
        if (activeSection === "analytics") {
            const token = localStorage.getItem("token");
            fetch("/api/analytics", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(res => {
                    if (!res.ok) throw new Error("Failed to fetch analytics");
                    return res.json();
                })
                .then(data => setAnalyticsData(data))
                .catch(() => setAnalyticsData({
                    totalUsers: 0,
                    activeChats: 0,
                    aiSuggestions: 0,
                    revenue: 0
                }));
        }
    }, [activeSection]);

    const handleCardClick = (path) => navigate(path);

    return (
        <div className="dashboard-layout" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

            {/* Header */}
            <header className="dashboard-header" style={{ flexShrink: 0 }}>
                <h1>Welcome, Admin</h1>
                <button className="sidebar-toggle" onClick={handleToggle}>
                    {sidebarOpen ? <FaTimes /> : <FaBars />}
                </button>
                <button className="sync-btn">Sync AI</button>
            </header>

            {/* Content */}
            <div className="dashboard-content" style={{ display: "flex", flex: 1 }}>

                {/* Sidebar */}
                <aside className={`sidebar ${sidebarOpen ? "open" : ""}`} style={{ flexShrink: 0 }}>
                    <h2>AI Admin</h2>
                    <nav>
                        <ul>
                            {sections.map(section => (
                                <li
                                    key={section.key}
                                    onClick={() => setActiveSection(section.key)}
                                    style={{ cursor: "pointer", fontWeight: activeSection === section.key ? "bold" : "normal" }}
                                >
                                    {section.icon} {section.label} {section.badge && <span className="ai-badge">{section.badge}</span>}
                                </li>
                            ))}
                            <li onClick={handleLogout} style={{ cursor: "pointer" }}>
                                <FaSignOutAlt /> Logout
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Main */}
                <main className="dashboard-main" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2rem", padding: "1rem" }}>

                    {/* Dashboard Cards */}
                    {activeSection === "dashboard" && (
                        <>
                            <section className="cards-section">
                                <div className="card trending-card" onClick={() => handleCardClick("/users")} style={{ cursor: "pointer" }}>
                                    <h3>Total Users</h3>
                                    <p>{analyticsData?.totalUsers || 1245}</p>
                                </div>
                                <div className="card analytics-card" onClick={() => handleCardClick("/chats")} style={{ cursor: "pointer" }}>
                                    <h3>Active Chats</h3>
                                    <p>{analyticsData?.activeChats || 324}</p>
                                </div>
                                <div className="card trending-card" onClick={() => handleCardClick("/suggestions")} style={{ cursor: "pointer" }}>
                                    <h3>AI Suggestions</h3>
                                    <p>{analyticsData?.aiSuggestions || 12} new</p>
                                    <span className="ai-badge">AI</span>
                                </div>
                                <div className="card analytics-card" onClick={() => handleCardClick("/revenue")} style={{ cursor: "pointer" }}>
                                    <h3>Revenue</h3>
                                    <p>${analyticsData?.revenue || 15430}</p>
                                </div>
                            </section>
                            <section className="charts-section">
                                <ChartComponent data={{
                                    labels: ["Users", "Active Chats", "AI Suggestions", "Revenue"],
                                    datasets: [{
                                        label: "Dashboard Analytics",
                                        data: [
                                            analyticsData?.totalUsers || 1245,
                                            analyticsData?.activeChats || 324,
                                            analyticsData?.aiSuggestions || 12,
                                            analyticsData?.revenue || 15430
                                        ],
                                        backgroundColor: ["#6a82fb", "#fc5c7d", "#ff7f50", "#00b894"]
                                    }]
                                }} type="bar" />
                            </section>
                        </>
                    )}

                    {/* Analytics Section */}
                    {activeSection === "analytics" && (
                        <section className="analytics-section" style={{ flex: 1 }}>
                            <h2>Analytics Overview</h2>
                            {analyticsData ? (
                                <>
                                    <div className="analytics-cards">
                                        <div className="card" onClick={() => handleCardClick("/users")} style={{ cursor: "pointer" }}>
                                            <h3>Total Users</h3><p>{analyticsData.totalUsers}</p>
                                        </div>
                                        <div className="card" onClick={() => handleCardClick("/chats")} style={{ cursor: "pointer" }}>
                                            <h3>Active Chats</h3><p>{analyticsData.activeChats}</p>
                                        </div>
                                        <div className="card" onClick={() => handleCardClick("/suggestions")} style={{ cursor: "pointer" }}>
                                            <h3>AI Suggestions</h3><p>{analyticsData.aiSuggestions} new</p>
                                        </div>
                                        <div className="card" onClick={() => handleCardClick("/revenue")} style={{ cursor: "pointer" }}>
                                            <h3>Revenue</h3><p>${analyticsData.revenue}</p>
                                        </div>
                                    </div>
                                    <ChartComponent data={{
                                        labels: ["Users", "Active Chats", "AI Suggestions", "Revenue"],
                                        datasets: [{
                                            label: "Analytics Overview",
                                            data: [
                                                analyticsData.totalUsers,
                                                analyticsData.activeChats,
                                                analyticsData.aiSuggestions,
                                                analyticsData.revenue
                                            ],
                                            backgroundColor: ["#6a82fb", "#fc5c7d", "#ff7f50", "#00b894"]
                                        }]
                                    }} type="bar" />
                                </>
                            ) : <p>Loading analytics...</p>}
                        </section>
                    )}

                    {/* Chatbot */}
                    {activeSection === "chatbot" && (
                        <section>
                            <h2>AI Chatbot</h2>
                            <Chatbot />
                        </section>
                    )}

                    {/* AI Tools */}
                    {activeSection === "tools" && (
                        <section>
                            <h2>AI Tools</h2>
                            <p>Tools content goes here.</p>
                        </section>
                    )}
                    {activeSection === "tools" && (
                        <section>
                            <h2>AI Tools</h2>
                            <ul>
                                <li onClick={() => handleCardClick("/tools/text-generator")} style={{ cursor: "pointer", color: "blue" }}>
                                    📝 Text Generator
                                </li>
                                <li>🎨 Image Generator (coming soon)</li>
                                <li>📊 Report Summarizer (coming soon)</li>
                            </ul>
                        </section>
                    )}
                    {activeSection === "tools" && (
                        <section>
                            <h2>AI Tools</h2>
                            <ul>
                                <li>
                                    <Link to="/tools/text-generator" style={{ color: "blue", textDecoration: "underline" }}>
                                        📝 Text Generator
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/tools/image-generator" style={{ color: "blue", textDecoration: "underline" }}>
                                        🎨 Image Generator
                                    </Link>
                                </li>
                                <li>📊 Report Summarizer (coming soon)</li>
                            </ul>
                        </section>
                    )}


                </main>
            </div>

            {/* Footer */}
            <footer className="dashboard-footer" style={{ marginTop: "auto", textAlign: "center", padding: "1rem", background: "#2c3e50", color: "#fff" }}>
                <p>© 2025 AI Dashboard | Josephine</p>
            </footer>
        </div>
    );
};

export default Dashboard;
