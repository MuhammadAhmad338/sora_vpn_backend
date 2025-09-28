import express from "express";
import { getPlans } from "../controllers/planControllers.js";

const router = express.Router();

// Get all plans
router.get("/", getPlans);

export default router;
