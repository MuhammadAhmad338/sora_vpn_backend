import express from "express";
import { getVPNConfigs } from "../controllers/vpnControllers.js";

const router = express.Router();

// GET all available configs
router.get("/configs", getVPNConfigs);

export default router;

