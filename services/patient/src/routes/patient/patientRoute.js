import express from "express";
import multer from "multer";
import { patientocr } from "../../controllers/patient/patientController.js";

const router = express.Router();


// Configure multer for file upload
const storage = multer.memoryStorage(); // keep file in memory
const upload = multer({ storage });


router.post("/ocr", upload.single("prescription"), patientocr);




export default router;