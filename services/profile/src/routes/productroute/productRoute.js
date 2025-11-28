import express from "express";
import { createProduct, deleteProduct, getAllProduct, getSingleProduct, updateProduct } from '../../controllers/productController/productController.js';
import { protect } from "../../middlewares/authMiddleware.js";


const router = express.Router();



router.get("/allproducts", protect, getAllProduct);

router.get("/singleProduct/:id", protect, getSingleProduct);

router.post("/createProduct", protect, createProduct);

router.put("/updateProduct/:id", protect, updateProduct);

router.delete("/deleteProduct/:id", protect, deleteProduct);



export default router;