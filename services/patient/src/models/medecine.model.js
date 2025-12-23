// models/Medicine.js
import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    prescription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prescription',
        required: true
    },

    // Medicine details
    name: { type: String, required: true },
    genericName: String,
    strength: String,
    form: String,

    // Dosage
    dosage: {
        amount: { type: Number, default: 1 },
        unit: { type: String, default: 'tablet' },
        frequency: { type: String, default: 'daily' },
        timesPerDay: Number,
        specificTimes: [String], // ["08:00", "12:00", "20:00"]
        daysOfWeek: [Number], // [1,2,3,4,5,6,7] - Sunday=1
        instructions: String
    },

    // Status
    status: {
        type: String,
        default: 'active', // active, paused, completed
        enum: ['active', 'paused', 'completed']
    },

    // Stock info
    hasStock: { type: Boolean, default: false },
    stockId: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock' },
    currentStock: { type: Number, default: 0 },

    // Duration
    startDate: { type: Date, default: Date.now },
    endDate: Date,

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const Medicine = mongoose.model('Medicine', medicineSchema);