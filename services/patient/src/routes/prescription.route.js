import express from 'express';
import { prescriptionControllers } from '../controllers/prescription.controller.js';
const router = express.Router();

// Get all prescriptions
router.get('/prescriptions', prescriptionControllers.getAllPrescription);  //protected

// Get single prescription with medicines
router.get('/prescription/:id', prescriptionControllers.getSinglePrescriptionWithMedecines);

// Create new prescription
router.post('/prescription', prescriptionControllers.createPrescription);

// Add medicine to prescription
router.post('/prescription/:id/medicines', prescriptionControllers.addMedecineToPrescription);

// Get expiring prescriptions
router.get('/prescription/expiring/soon', prescriptionControllers.getExpiringPrescreption);

export default router;