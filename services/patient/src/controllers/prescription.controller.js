import { Dose } from "../models/dose.model.js";
import { Medicine } from "../models/medecine.model.js";
import { Prescription } from "../models/prescription.model.js";
// Helper function to create doses
async function createDosesForMedicine(medicine, startDate = new Date()) {
    try {
        console.log(medicine)
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + medicine.totalDays);

        const doses = [];
        const currentDate = new Date();
        while (currentDate <= endDate) {
            for (const timeStr of medicine.dosage.specificTimes) {
                doses.push({
                    user: medicine.user,
                    medicine: medicine._id,
                    scheduledTime: timeStr,
                    status: 'pending',
                    scheduledDate: new Date(currentDate).toISOString().split('T')[0]
                });
            }
            console.log(currentDate)
            currentDate.setDate(currentDate.getDate() + 1);
        }
        // Save all doses
        if (doses.length > 0) {
            await Dose.insertMany(doses);
        }

        return doses.length;
    } catch (err) {
        console.log(err)
        return "failed"
    }
}

function getDefaultTimes(timesPerDay) {
    switch (timesPerDay) {
        case 1: return ['09:00'];
        case 2: return ['09:00', '21:00'];
        case 3: return ['08:00', '12:00', '20:00'];
        case 4: return ['08:00', '12:00', '16:00', '20:00'];
        default: return ['09:00'];
    }
}

const getAllPrescription = async (req, res) => {
    try {
        const user = req.headers['x-user-id']
        const prescriptions = await Prescription.find({ user: user })
            .sort('-createdAt');

        // Get medicine count for each prescription
        const prescriptionsWithCount = await Promise.all(
            prescriptions.map(async (prescription) => {
                // const medicineCount = await Medicine.countDocuments({
                //     prescription: prescription._id,
                //     user: user
                // });

                const medicines = await Medicine.find({
                    prescription: prescription._id,
                    user: user
                });
                return {
                    ...prescription.toObject(),
                    // medicinesCount: medicineCount,
                    medicines: medicines
                };
            })
        );

        res.json({ success: true, data: prescriptionsWithCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getSinglePrescriptionWithMedecines = async (req, res) => {
    const user = req.headers['x-user-id']
    try {
        const prescription = await Prescription.findOne({
            _id: req.params.id,
            user: user
        });

        if (!prescription) {
            return res.status(404).json({ error: 'Prescription not found' });
        }

        // Get all medicines for this prescription
        const medicines = await Medicine.find({
            prescription: prescription._id,
            user: user
        });

        res.json({
            success: true,
            data: {
                prescription,
                medicines
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createPrescription = async (req, res) => {
    try {
        const { doctorName, doctorType, doctorContact, prescriptionDate, validUntil } = req.body;
        const user = req.headers['x-user-id']
        const prescription = await Prescription.create({
            user: user,
            doctorName,
            doctorType,
            doctorContact,
            prescriptionDate: prescriptionDate || new Date(),
            validUntil
        });

        res.status(201).json({
            success: true,
            data: prescription,
            message: 'Prescription created'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const addMedecineToPrescription = async (req, res) => {
    try {
        const user = req.headers['x-user-id']
        const prescription = await Prescription.findOne({
            _id: req.params.id,
            user: user
        });

        if (!prescription) {
            return res.status(404).json({ error: 'Prescription not found' });
        }

        const { name, strength, form, dosage, totalDays, takenDays } = req.body;

        // Create medicine under this prescription
        const medicine = await Medicine.create({
            takenDays: takenDays || 0,
            totalDays: totalDays || 0,
            user: user,
            prescription: prescription._id,
            name,
            strength,
            form,
            dosage: {
                amount: dosage?.amount || 1,
                unit: dosage?.unit || 'tablet',
                frequency: dosage?.frequency || 'daily',
                timesPerDay: dosage?.timesPerDay || 1,
                specificTimes: dosage?.specificTimes,
                daysOfWeek: dosage?.daysOfWeek || [1, 2, 3, 4, 5, 6, 7],
                instructions: dosage?.instructions
            }
        });

        // Update prescription medicine count
        prescription.medicinesCount += 1;
        await prescription.save();

        // Create doses for this medicine
        await createDosesForMedicine(medicine);

        res.status(201).json({
            success: true,
            data: medicine,
            message: 'Medicine added to prescription'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getExpiringPrescreption = async (req, res) => {
    try {
        const user = req.headers['x-user-id']
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

        const prescriptions = await Prescription.find({
            user: user,
            validUntil: { $lte: sevenDaysFromNow },
            status: 'active'
        });

        res.json({ success: true, data: prescriptions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const getDashboardSummary = async (req, res) => {
    try {
        const user = req.headers['x-user-id']
        const prescriptions = await Prescription.countDocuments({ user: user });
        const medicines = await Medicine.countDocuments({ user: user });
        const expiringPrescriptions = await Prescription.countDocuments({
            user: user,
            validUntil: { $lte: new Date() }
        });

        const expiringMedicines = await Medicine.countDocuments({
            user: user,
            endDate: { $lte: new Date() }
        });

        const lowStockMedicines = await Medicine.countDocuments({
            user: user,
            stockQuantity: { $lte: 5 }
        });

        const todayDoses = await Dose.countDocuments({
            user: user,
            scheduledTime: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
        });

        res.json({
            success: true,
            data: {
                totalPrescriptions: prescriptions,
                totalMedicines: medicines,
                expiringPrescriptionsCount: expiringPrescriptions,
                expiringMedicinesCount: expiringMedicines,
                lowStockMedicinesCount: lowStockMedicines,
                todayDosesCount: todayDoses
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const prescriptionControllers = { getAllPrescription, getSinglePrescriptionWithMedecines, createPrescription, addMedecineToPrescription, getExpiringPrescreption, getDashboardSummary }