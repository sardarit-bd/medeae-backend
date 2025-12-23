const Medicine = require('../models/Medicine');
const Dose = require('../models/Dose');
const moment = require('moment');

class ScheduleService {
    // Generate doses for today
    async generateDailyDoses(userId) {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            // Check if doses already exist for today
            const existingDoses = await Dose.find({
                user: userId,
                scheduledTime: { $gte: today, $lt: tomorrow }
            });

            if (existingDoses.length > 0) {
                return { generated: 0, message: 'Doses already exist for today' };
            }

            // Get active medicines with schedule
            const medicines = await Medicine.find({
                user: userId,
                status: 'active',
                'dosage.frequency': 'daily'
            });

            let totalDoses = 0;

            for (const medicine of medicines) {
                const doses = await this.generateMedicineDoses(medicine, today);
                totalDoses += doses.length;
            }

            return { generated: totalDoses, message: 'Daily doses generated' };
        } catch (error) {
            console.error('Error generating daily doses:', error);
            throw error;
        }
    }

    // Generate doses for specific medicine
    async generateMedicineDoses(medicine, date) {
        const doses = [];
        const times = medicine.dosage.specificTimes || this.getDefaultTimes(medicine.dosage.timesPerDay);

        for (const timeStr of times) {
            const [hours, minutes] = timeStr.split(':').map(Number);
            const scheduledTime = new Date(date);
            scheduledTime.setHours(hours, minutes, 0, 0);

            const dose = new Dose({
                user: medicine.user,
                medicine: medicine._id,
                scheduledTime,
                status: 'pending'
            });

            await dose.save();
            doses.push(dose);
        }

        return doses;
    }

    // Get default times based on frequency
    getDefaultTimes(timesPerDay) {
        switch (timesPerDay) {
            case 1:
                return ['09:00'];
            case 2:
                return ['09:00', '21:00'];
            case 3:
                return ['08:00', '12:00', '20:00'];
            case 4:
                return ['08:00', '12:00', '16:00', '20:00'];
            default:
                return ['09:00'];
        }
    }

    // Check for due doses
    async checkDueDoses() {
        try {
            const now = new Date();
            const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
            const fifteenMinutesLater = new Date(now.getTime() + 15 * 60 * 1000);

            const dueDoses = await Dose.find({
                status: 'pending',
                scheduledTime: {
                    $gte: fifteenMinutesAgo,
                    $lte: fifteenMinutesLater
                }
            }).populate('user medicine');

            return dueDoses;
        } catch (error) {
            console.error('Error checking due doses:', error);
            throw error;
        }
    }

    // Mark dose as taken
    async markDoseTaken(doseId, takenTime = new Date(), notes = '') {
        try {
            const dose = await Dose.findById(doseId)
                .populate('medicine')
                .populate('user');

            if (!dose) {
                throw new Error('Dose not found');
            }

            dose.status = 'taken';
            dose.takenTime = takenTime;
            dose.notes = notes;

            // Deduct from stock if medicine has stock
            if (dose.medicine.hasStock && dose.medicine.stock) {
                await this.deductFromStock(dose.medicine.stock, dose.medicine.dosage.amount);
                dose.stockDeducted = true;
            }

            await dose.save();
            return dose;
        } catch (error) {
            console.error('Error marking dose as taken:', error);
            throw error;
        }
    }

    // Deduct from stock
    async deductFromStock(stockId, amount) {
        try {
            const stock = await require('../models/Stock').findById(stockId);
            if (!stock) {
                throw new Error('Stock not found');
            }

            if (stock.quantity < amount) {
                throw new Error('Insufficient stock');
            }

            stock.quantity -= amount;
            stock.lastUsed = new Date();
            await stock.save();

            return stock;
        } catch (error) {
            console.error('Error deducting from stock:', error);
            throw error;
        }
    }
}

module.exports = new ScheduleService();