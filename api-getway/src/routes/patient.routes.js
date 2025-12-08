import express from "express";
import proxyController from "../controller/proxyController.js";
import { checkAuth } from '../middlewares/checkAuth.js';
const router = express.Router();

router.post("/ocr", checkAuth('patient', 'doctor'), proxyController.patient);

export default router;
