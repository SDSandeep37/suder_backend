import express from 'express';
import { createPayment, getAllPayments,getPaymentById,updatePayment,deletePayment, confirmPayment, checkPaymentsContoller } from '../controllers/paymentsContoller.js';


const router = express.Router();

// Get all payments
router.get('/', getAllPayments);  
// Get a payment by ID
router.get('/:id', getPaymentById);
router.get('/:id/check', checkPaymentsContoller);
// Create a new payment
router.post('/create-intent', createPayment);
router.post('/confirm', confirmPayment  );
// Update a payment
router.put('/:id', updatePayment);
// Delete a payment
router.delete('/:id', deletePayment);
//conf
export default router;