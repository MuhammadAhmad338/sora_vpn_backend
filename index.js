import cors from "cors";
import morgan from "morgan";
import express from "express";
import connectDB  from "./db.js";
import vpnRoutes from "./Routes/vpnRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import planRoutes from "./Routes/planRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import feedbackRoutes from "./Routes/feedbackRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Connect DB
connectDB();

// Routes
app.use("/api/vpn", vpnRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/user", userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
