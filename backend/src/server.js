import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.js";
import mongoose from "mongoose";
import chatRoutes from "./routes/chatRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import rateLimit from "express-rate-limit";
import cors from "cors";

connectDB();

const app = express();

// Allow frontend to talk to backend
app.use(cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true // allow cookies if needed
}));

app.use(express.json());


app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);

// Add Basic Health Route
app.get("/api/test", (req, res) => {
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