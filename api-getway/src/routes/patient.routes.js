import express from "express";
import proxyController from "../controller/proxyController.js";
import { checkAuth } from '../middlewares/checkAuth.js';
const router = express.Router();

router.post("/ocr", checkAuth('patient', 'doctor'), proxyController.patient);

// -------------------- -------------------------------------Prescription Routs -----------------------------------------
// Get all prescriptions
router.get('/prescription', checkAuth('patient', 'doctor'), proxyController.patient);

// Get single prescription with medicines
router.get('/prescription/:id', checkAuth('patient', 'doctor'), proxyController.patient);

// Create new prescription
router.post('/prescription', checkAuth('patient', 'doctor'), proxyController.patient);

// Add medicine to prescription
router.post('/prescription/:id/medicines', checkAuth('patient', 'doctor'), proxyController.patient);

// Get expiring prescriptions
router.get('/prescription/expiring/soon', checkAuth('patient', 'doctor'), proxyController.patient);

// ---------------------------------------------------------------Medecines Routes -------------------------------------------------------

router.get('/medecines', checkAuth('patient', 'doctor'), proxyController.patient);


// --------------------------------------------------- Stock Routes ----------------------------------------------

// Get all stock items with medicine and prescription info
router.get('/stock/', proxyController.patient);

// Add stock for a medicine
router.post('/stock/', proxyController.patient);

// Get medicines for dropdown (active medicines without stock)
router.get('/stock/medicines-for-dropdown', proxyController.patient);

// Update stock quantity
router.put('/stock/:id/quantity', proxyController.patient);

// Deduct from stock (when dose taken)
router.post('/stock/:id/deduct', proxyController.patient);

// Get low stock medicines
router.get('/stock/low-stock', proxyController.patient);



// ---------------------------------------------------------------------- Doses Routes ----------------------------------------------
router.post('/:id/take', proxyController.patient);

// Get doses by prescription
router.get('/prescription/:prescriptionId', proxyController.patient);

// Get adherence stats by prescription
router.get('/stats/prescription/:prescriptionId', proxyController.patient)

export default router;
