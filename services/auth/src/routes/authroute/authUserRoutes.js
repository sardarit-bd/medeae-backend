import express from "express";
import { registerUser } from "../../controllers/authcontroller/authuserController.js";


const router = express.Router();



router.post("/register", registerUser);
router.post("/login", (req, res) => {
    res.send("Login User");

});


export default router;