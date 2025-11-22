// User is that 
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/user.js";

dotenv.config();

export const getUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        console.log("Token received:", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        console.log("Decoded User ID:", userId);

        // Fetch user details from the database using userId
        const user = await User.findById(userId).select("-password").populate("subscribedPlan");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        res.status(401).json({ message: "Unauthorized", error: error.message });
    }
};


// Link the plan with the user now 
export const subscribePlan = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const planId = req.body.planId || req.body.plan_id; // Support both camelCase and snake_case

        if (!planId) {
            return res.status(400).json({ message: "Plan ID is required" });
        }

        // Validate if planId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(planId)) {
            return res.status(400).json({ message: "Invalid Plan ID format." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.subscribedPlan = planId;
        await user.save();

        res.json({ message: "Plan subscribed successfully", user });
    } catch (error) {
        res.status(401).json({ message: "Unauthorized", error: error.message });
    }
}


