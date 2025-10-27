import express from "express";
import { contactController } from "../controllers/feedbackController.js";
import { feedbackController } from "../controllers/feedbackController.js";

const router = express.Router();
router.post("/store", feedbackController);
router.post("/contact", contactController);

export default router;