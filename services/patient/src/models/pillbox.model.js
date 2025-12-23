import mongoose from 'mongoose'

const compartmentSchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        required: true
    },
    time: {
        type: String,
        enum: ['morning', 'noon', 'evening', 'night'],
        required: true
    },
    medicines: [{
        medicine: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Medicine'
        },
        taken: {
            type: Boolean,
            default: false
        },
        takenTime: Date
    }],
    allTaken: {
        type: Boolean,
        default: false
    }
});

const pillboxSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        default: 'Weekly Pill Organizer'
    },
    type: {
        type: String,
        enum: ['weekly', 'monthly', 'custom'],
        default: 'weekly'
    },
    compartments: [compartmentSchema],
    validFrom: {
        type: Date,
        required: true
    },
    validUntil: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Pillbox = mongoose.model('Pillbox', pillboxSchema);
export Pillbox