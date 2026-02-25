import express from 'express';
import { createPayment, getAllPayments,getPaymentById,updatePayment,deletePayment } from '../controllers/paymentsContoller.js';


const router = express.Router();

// Get all payments
router.get('/', getAllPayments);  
// Get a payment by ID
router.get('/:id', getPaymentById);
// Create a new payment
router.post('/', createPayment);
// Update a payment
router.put('/:id', updatePayment);
// Delete a payment
router.delete('/:id', deletePayment);

export default router;