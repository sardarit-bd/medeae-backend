import express from "express";
import passport from 'passport';

import { getMe, googleCallbackController, sendOtp, verifyOtp } from "../../controllers/authcontroller/authuserController.js";
import { changePassword } from "../../controllers/authcontroller/changePassword.controller.js";
import { forgotPassword } from "../../controllers/authcontroller/forgotPassword.controller.js";
import { loginUser } from "../../controllers/authcontroller/login.controller.js";
import { logout } from "../../controllers/authcontroller/logout.controller.js";
import { registerUser } from "../../controllers/authcontroller/register.controller.js";
import { resetPassword } from "../../controllers/authcontroller/resetPassword.controller.js";
import { checkAuth } from "../../middlewares/checkAuth.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);


router.post(
    "/change-password",
    checkAuth('patient'),
    changePassword
);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", checkAuth('patient', 'doctor'), resetPassword);

router.post('/send-otp', sendOtp)
router.post('/verify-otp', verifyOtp)
router.get('/me', checkAuth('patient', 'doctor'), getMe)

router.get(
    "/google",
    async (req, res, next) => {
        const redirect = req.query.redirect || "/";
        passport.authenticate("google", {
            scope: ["profile", "email"],
            state: redirect,
            session: false
        })(req, res, next);
    }
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: `${process.env.CORS_ORIGIN}/login?error=There is some issues with your account. Please Contact with our support team.`,
        session: false
    }),
    googleCallbackController
);

export default router;