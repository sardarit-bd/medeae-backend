import express from "express";
import proxyController from "../controller/proxyController.js";

const router = express.Router();

router.post("/login", proxyController.auth);
router.post("/register", proxyController.auth);
router.get("/me", proxyController.auth);


export default router;
