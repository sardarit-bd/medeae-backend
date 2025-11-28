import express from "express";
import { createProfileInfo, deleteProfileInfo, getAllUserProfileInfo, getSingleUserProfileInfo, updateProfileInfo } from '../../controllers/profile/profileController.js';
import { protect } from "../../middlewares/authMiddleware.js";


const router = express.Router();



router.get("/allproducts", protect, getAllUserProfileInfo);

router.get("/singleProduct/:id", protect, getSingleUserProfileInfo);

router.post("/createProduct", protect, createProfileInfo);

router.put("/updateProduct/:id", protect, updateProfileInfo);

router.delete("/deleteProduct/:id", protect, deleteProfileInfo);



export default router;