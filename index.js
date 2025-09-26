import cors from "cors";
import morgan from "morgan";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import vpnRoutes from "./Routes/vpnRoutes.js";
import authRoutes from "./Routes/authRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Connect DB
connectDB();

// Routes
app.use("/api/vpn", vpnRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
