import { Medicine } from "../models/medecine.model.js";

const takeDoes = async (req, res) => {
    try {
        const user = req.headers['x-user-id']
        const dose = await Dose.findOne({
            _id: req.params.id,
            user: user
        }).populate({
            path: 'medicine',
            populate: {
                path: 'prescription',
                select: 'doctorName'
            }
        });

        if (!dose) {
            return res.status(404).json({ error: 'Dose not found' });
        }

        // Update dose status
        dose.status = 'taken';
        dose.takenTime = new Date();
        await dose.save();

        // Deduct from stock if medicine has stock
        if (dose.medicine.hasStock && dose.medicine.stockId) {
            try {
                const stock = await Stock.findById(dose.medicine.stockId);
                if (stock && stock.quantity >= dose.medicine.dosage.amount) {
                    stock.quantity -= dose.medicine.dosage.amount;
                    await stock.save();

                    // Update medicine current stock
                    dose.medicine.currentStock = stock.quantity;
                    await dose.medicine.save();
                }
            } catch (stockError) {
                console.log('Stock deduction error:', stockError);
                // Continue even if stock deduction fails
            }
        }

        res.json({
            success: true,
            data: dose,
            message: 'Dose marked as taken'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


const getDosesByPrescription = async (req, res) => {
    try {
        const user = req.headers['x-user-id']
        const { date } = req.query;

        const medicines = await Medicine.find({
            prescription: req.params.prescriptionId,
            user: user
        }).select('_id');

        const medicineIds = medicines.map(m => m._id);

        // Date filter
        let dateFilter = {};
        if (date) {
            const selectedDate = new Date(date);
            selectedDate.setHours(0, 0, 0, 0);
            const nextDay = new Date(selectedDate);
            nextDay.setDate(nextDay.getDate() + 1);

            dateFilter = {
                scheduledTime: { $gte: selectedDate, $lt: nextDay }
            };
        } else {
            // Default to today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            dateFilter = {
                scheduledTime: { $gte: today, $lt: tomorrow }
            };
        }

        const doses = await Dose.find({
            user: user,
            medicine: { $in: medicineIds },
            ...dateFilter
        })
            .populate({
                path: 'medicine',
                populate: {
                    path: 'prescription',
                    select: 'doctorName'
                }
            })
            .sort('scheduledTime');

        res.json({ success: true, data: doses });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getDosesStates = async (req, res) => {
    try {
        const { days = 30 } = req.query;

        const medicines = await Medicine.find({
            prescription: req.params.prescriptionId,
            user: req.user._id
        }).select('_id');

        const medicineIds = medicines.map(m => m._id);

        // Date range
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));
        startDate.setHours(0, 0, 0, 0);

        const doses = await Dose.find({
            user: req.user._id,
            medicine: { $in: medicineIds },
            scheduledTime: { $gte: startDate }
        });

        const total = doses.length;
        const taken = doses.filter(d => d.status === 'taken').length;
        const missed = doses.filter(d => d.status === 'missed').length;
        const pending = doses.filter(d => d.status === 'pending').length;

        const adherenceRate = total > 0 ? (taken / total) * 100 : 0;

        res.json({
            success: true,
            data: {
                period: `${days} days`,
                prescriptionId: req.params.prescriptionId,
                summary: {
                    total,
                    taken,
                    missed,
                    pending,
                    adherenceRate: Math.round(adherenceRate * 10) / 10
                }
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const dosesController = {
    takeDoes,
    getDosesByPrescription,
    getDosesStates
}