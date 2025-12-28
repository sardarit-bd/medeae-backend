import { Medicine } from "../models/medecine.model.js";
import { Stock } from "../models/stock.model.js";

const getAllStocks = async (req, res) => {
    try {
        const user = req.headers['x-user-id']
        const stockItems = await Stock.find({ user: user })
            .populate({
                path: 'medicineId',
                populate: {
                    path: 'prescription',
                    select: 'doctorName prescriptionDate'
                }
            })
            .sort('-createdAt');

        res.json({ success: true, data: stockItems });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const addStock = async (req, res) => {
    try {
        const user = req.headers['x-user-id']
        const { medicineId, quantity, unit, purchasedFrom, expiryDate, price, storage } = req.body;

        // Verify medicine exists and belongs to user
        console.log(medicineId, user)
        const medicine = await Medicine.findOne({
            _id: medicineId,
            user: user
        }).populate('prescription');

        if (!medicine) {
            return res.status(404).json({ error: 'Medicine not found' });
        }

        // Create stock item
        const stockItem = await Stock.create({
            user: user,
            medicineId: medicine._id,
            quantity,
            unit: unit || 'tablets',
            initialQuantity: quantity,
            purchasedFrom,
            expiryDate,
            price,
            purchaseDate: new Date()
        });

        // Update medicine stock info
        medicine.hasStock = true;
        medicine.stockId = stockItem._id;
        medicine.currentStock = medicine?.currentStock + quantity;
        medicine.updatedAt = new Date();
        medicine.storage = storage || 'Medicine cabinet';
        medicine.expiryDate = expiryDate;
        await medicine.save();

        res.status(201).json({
            success: true,
            data: {
                stock: stockItem,
                medicine: {
                    id: medicine._id,
                    name: medicine.name,
                    prescription: medicine.prescription
                }
            },
            message: `Stock added for ${medicine.name}`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getMedecineDropDown = async (req, res) => {
    try {
        const user = req.headers['x-user-id']
        const medicines = await Medicine.find({
            user: user,
            status: 'active'
        })
            .populate('prescription', 'doctorName prescriptionDate')
            .select('name strength form dosage prescription');

        // Format for dropdown
        const dropdownOptions = medicines.map(med => ({
            value: med._id,
            label: `${med.name} ${med.strength ? med.strength : ''} (${med.form})`,
            sublabel: `Prescribed by: ${med.prescription.doctorName}`,
            medicine: med
        }));

        res.json({ success: true, data: dropdownOptions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateStockQuantity = async (req, res) => {
    try {
        const user = req.headers['x-user-id']
        const { quantity } = req.body;

        const stock = await Stock.findOne({
            _id: req.params.id,
            user: user
        }).populate('medicineId');

        if (!stock) {
            return res.status(404).json({ error: 'Stock item not found' });
        }

        // Update stock
        stock.quantity = quantity;
        await stock.save();

        // Update medicine current stock
        if (stock.medicineId) {
            stock.medicineId.currentStock = quantity;
            await stock.medicineId.save();
        }

        res.json({
            success: true,
            data: stock,
            message: 'Stock quantity updated'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deductStock = async (req, res) => {
    try {
        const user = req.headers['x-user-id']
        const { amount = 1 } = req.body;

        const stock = await Stock.findOne({
            _id: req.params.id,
            user: user
        }).populate('medicineId');

        if (!stock) {
            return res.status(404).json({ error: 'Stock item not found' });
        }

        if (stock.quantity < amount) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }

        // Update stock
        stock.quantity -= amount;
        await stock.save();

        // Update medicine current stock
        if (stock.medicineId) {
            stock.medicineId.currentStock = stock.quantity;
            await stock.medicineId.save();
        }

        res.json({
            success: true,
            data: stock,
            message: `${amount} ${stock.unit || 'units'} deducted`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getLowStock = async (req, res) => {
    try {
        const user = req.headers['x-user-id']
        const { threshold = 7 } = req.query;

        const stockItems = await Stock.find({
            user: user,
            quantity: { $lte: parseInt(threshold) }
        })
            .populate('medicineId')
            .sort('quantity');

        res.json({ success: true, data: stockItems });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const stcokController = { getAllStocks, addStock, getMedecineDropDown, updateStockQuantity, deductStock, getLowStock }