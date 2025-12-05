import express from "express";
import proxyController from "../controller/proxyController.js";

const router = express.Router();

router.post("/login", proxyController.auth);
router.post("/register", proxyController.auth);
router.post("/logout", proxyController.auth);
router.post("/change-password", proxyController.auth);
router.post("/forgot-password", proxyController.auth);
router.post("/reset-password", proxyController.auth);

router.get('/google', proxyController.auth)
router.get('/google/callback', proxyController.auth)
router.get("/me", proxyController.auth);

router.post('/send-otp', proxyController.auth)
router.post('/verify-otp', proxyController.auth)

export default router;
