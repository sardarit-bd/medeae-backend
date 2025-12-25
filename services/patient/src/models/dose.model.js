import mongoose from 'mongoose';

const doseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },

    scheduledTime: { type: Date, required: true },
    takenTime: Date,

    status: {
        type: String,
        default: 'pending', // pending, taken, missed, to take, future
        enum: ['pending', 'taken', 'missed', 'to take', 'future']
    },

    createdAt: { type: Date, default: Date.now }
});

// Index for performance
doseSchema.index({ user: 1, scheduledTime: 1 });

export const Dose = mongoose.model('Dose', doseSchema);