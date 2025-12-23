import { Medicine } from "../models/medecine.model.js";

// Create doses based on medicine schedule
async function createDosesForMedicine(medicine, startDate = new Date()) {
    const doses = [];
    const times = medicine.dosage.specificTimes || getDefaultTimes(medicine.dosage.timesPerDay);

    // Create doses for next 30 days
    for (let i = 0; i < medicine.totalDays; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);

        // Check if this day is in schedule
        const dayOfWeek = date.getDay() + 1; // Sunday=1, Monday=2, etc.
        if (!medicine.dosage.daysOfWeek || medicine.dosage.daysOfWeek.includes(dayOfWeek)) {
            for (const timeStr of times) {
                const [hours, minutes] = timeStr.split(':').map(Number);
                const scheduledTime = new Date(date);
                scheduledTime.setHours(hours, minutes, 0, 0);

                doses.push({
                    user: medicine.user,
                    medicine: medicine._id,
                    scheduledTime,
                    status: 'pending'
                });
            }
        }
    }

    // Save all doses
    if (doses.length > 0) {
        await Dose.insertMany(doses);
    }

    return doses.length;
}

// Get default times
function getDefaultTimes(timesPerDay) {
    switch (timesPerDay) {
        case 1: return ['09:00'];
        case 2: return ['09:00', '21:00'];
        case 3: return ['08:00', '12:00', '20:00'];
        default: return ['09:00'];
    }
}

const getAllMedecines = async (req, res) => {
    try {
        const user = req.headers['x-user-id']
        const medicines = await Medicine.find({ user: user })
            .populate('prescription', 'doctorName prescriptionDate validUntil')
            .sort('-createdAt');

        res.json({ success: true, data: medicines });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const getMedecineWithoutStock = async (req, res) => {
    try {
        const user = req.headers['x-user-id']
        const medicines = await Medicine.find({
            user: user,
            hasStock: false,
            status: 'active'
        }).select('name strength form dosage');

        res.json({ success: true, data: medicines });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateMedecine = async (req, res) => {
    try {
        const user = req.headers['x-user-id']
        const medicine = await Medicine.findOne({
            _id: req.params.id,
            user: user
        });

        if (!medicine) {
            return res.status(404).json({ error: 'Medicine not found' });
        }

        // Update medicine
        Object.assign(medicine, req.body);
        await medicine.save();

        res.json({ success: true, data: medicine });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteMedecine = async (req, res) => {
    try {
        const user = req.headers['x-user-id']
        const medicine = await Medicine.findOne({
            _id: req.params.id,
            user: user
        });

        if (!medicine) {
            return res.status(404).json({ error: 'Medicine not found' });
        }

        // Delete related doses
        await Dose.deleteMany({ medicine: medicine._id });

        // Delete medicine
        await medicine.deleteOne();

        res.json({ success: true, message: 'Medicine deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const medicineControllers = { getAllMedecines, getMedecineWithoutStock, updateMedecine, deleteMedecine }