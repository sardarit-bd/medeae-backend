import express from 'express';
import { stcokController } from '../controllers/stock.controller.js';

const router = express.Router()

// Get all stock items with medicine and prescription info
router.get('/', stcokController.getAllStocks);

// Add stock for a medicine
router.post('/', stcokController.addStock);

// Get medicines for dropdown (active medicines without stock)
router.get('/medicines-for-dropdown', stcokController.getMedecineDropDown);

// Update stock quantity
router.put('/:id/quantity', stcokController.updateStockQuantity);

// Deduct from stock (when dose taken)
router.post('/:id/deduct', stcokController.deductStock);

// Get low stock medicines
router.get('/low-stock', stcokController.getLowStock);

export default router;