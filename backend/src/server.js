import express from "express";
import connectDB from "./config/db.js";
import mongoose from "mongoose";

connectDB();

const app = express();

// Add Basic Health Route
app.get("/api/health", (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    res.status(200).json({
        success: true,
        message: "Server is healthy",
        database: dbStatus,
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000")
});