import express from "express";
import passport from 'passport';
import { googleCallbackController, loginUser, registerUser } from "../../controllers/authcontroller/authuserController.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

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