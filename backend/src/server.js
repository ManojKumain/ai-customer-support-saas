import OpenAI from "openai";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import mongoose from "mongoose";
import chatRoutes from "./routes/chatRoutes.js"

connectDB();
dotenv.config();

const app = express();
app.use(express.json());


app.use("/api/chat", chatRoutes);

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