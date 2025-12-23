import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    doctorName: { type: String, required: true },
    doctorType: { type: String, default: 'General Practitioner' },
    doctorContact: String,

    prescriptionDate: { type: Date, default: Date.now },
    validUntil: { type: Date, required: true },


    status: {
        type: String,
        default: 'active', // active, expired, completed
        enum: ['active', 'expired', 'completed']
    },

    medicinesCount: { type: Number, default: 0 },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update status based on date
prescriptionSchema.pre('save', function (next) {
    const now = new Date();

    if (this.validUntil < now) {
        this.status = 'expired';
    }

    this.updatedAt = Date.now();
    next();
});

export const Prescription = mongoose.model('Prescription', prescriptionSchema);