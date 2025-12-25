// routes/doses.js
import express from 'express';
import { dosesController } from '../controllers/doses.controller.js';
const router = express.Router();

// Mark dose as taken with stock deduction
router.get('/', dosesController.getDosesByUser);
router.post('/:id/take', dosesController.takeDoes);

// Get doses by prescription
router.get('/prescription/:prescriptionId', dosesController.getDosesByPrescription);

// Get adherence stats by prescription
router.get('/stats/prescription/:prescriptionId', dosesController.getDosesStates);


export default router;