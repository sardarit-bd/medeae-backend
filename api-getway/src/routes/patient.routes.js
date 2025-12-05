import express from "express";
import proxyController from "../controller/proxyController.js";

const router = express.Router();

router.post("/ocr", proxyController.patient);

export default router;
