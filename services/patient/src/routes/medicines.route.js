import express from 'express';
import { medicineControllers } from '../controllers/medecines.controller.js';
const router = express.Router();

// Get all medicines (with prescription info)
router.get('/medecines', medicineControllers.getAllMedecines);


// Update medicine stock info
router.put('/medecines/:id/stock', medicineControllers.updateMedecine);

// Get medicines without stock for dropdown
router.get('/medecines/without-stock', async (req, res) => {
    try {
        const medicines = await Medicine.find({
            user: req.user._id,
            hasStock: false,
            status: 'active'
        })
            .populate('prescription', 'doctorName')
            .select('name strength form dosage prescription');

        res.json({ success: true, data: medicines });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete medicine
router.delete('medecines/:id', async (req, res) => {
    try {
        const medicine = await Medicine.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!medicine) {
            return res.status(404).json({ error: 'Medicine not found' });
        }

        // Update prescription medicine count
        await Prescription.findByIdAndUpdate(medicine.prescription, {
            $inc: { medicinesCount: -1 }
        });

        // Delete related doses
        await Dose.deleteMany({ medicine: medicine._id });

        // Delete medicine
        await medicine.deleteOne();

        res.json({ success: true, message: 'Medicine deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;