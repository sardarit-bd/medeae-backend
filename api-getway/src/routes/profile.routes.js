import express from "express";
import proxyController from "../controller/proxyController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, proxyController.profile);
router.put("/", protect, proxyController.profile);

export default router;
