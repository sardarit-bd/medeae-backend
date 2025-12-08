import mongoose from "mongoose";

const MedicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    strength: { type: String },
    instructions: { type: String }
}, { _id: false });

const ScheduleSchema = new mongoose.Schema({
    times: { type: [String], default: [] },          // []
    start_date: { type: Date, required: true },      // "2015-04-13"
    frequency_type: { type: String, required: true },// "daily", "every 6 hours as needed"
    dosage_per_intake: { type: String }              // "1 capsule", "2 tablets"
}, { _id: false });

const PrescriptionItemSchema = new mongoose.Schema({
    userId: { type: String, required: true },

    medicine: { type: MedicineSchema, required: true },
    schedule: { type: ScheduleSchema, required: true },

    source: { type: String, enum: ["ocr", "manual"], default: "ocr" }
}, { timestamps: true });

export default mongoose.model("PrescriptionItem", PrescriptionItemSchema);
