import express from "express";
import { getPlans, addPlan } from "../controllers/planControllers.js";

const router = express.Router();

// Get all plans
router.get("/plans", getPlans);
router.post("/addPlan", addPlan);

export default router;
