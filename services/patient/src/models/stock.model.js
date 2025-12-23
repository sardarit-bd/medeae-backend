import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },

    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, default: 'tablets' },

    purchasedFrom: String,
    expiryDate: Date,

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const Stock = mongoose.model('Stock', stockSchema);
