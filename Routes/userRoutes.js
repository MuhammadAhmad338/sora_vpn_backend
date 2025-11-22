import express from "express";
import { getUser, subscribePlan } from "../controllers/userController.js";

const router = express.Router();

// Get user details
router.get("/", getUser);
router.post("/subscribe", subscribePlan);

export default router;
