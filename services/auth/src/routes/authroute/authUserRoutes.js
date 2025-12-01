import express from "express";
import passport from 'passport';
import { changePassword, googleCallbackController, loginUser, logout, registerUser } from "../../controllers/authcontroller/authuserController.js";
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

// router.post("/forgot-password", AuthControllers.forgotPassword);
// router.post(
//     "/reset-password",
//     checkAuth(...Object.values(Role)),
//     AuthControllers.resetPassword
// );


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