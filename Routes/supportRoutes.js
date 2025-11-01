import express from "express";
import { postSupport } from "../controllers/supportController.js";

const router = express.Router();

// POST support feedback
router.post("/create", postSupport);

export default router;