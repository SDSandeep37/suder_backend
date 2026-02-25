import * as Payments from '../models/paymentsModel.js';

// Get all payments
export const getAllPayments = async (req, res) => {
  try { 
    const payments = await Payments.getAllPayments();
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to get payments' });
  } 
};

// Get a payment by ID
export const getPaymentById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Payment ID is required' });
  }
  try {
    const payment = await Payments.getPaymentById(id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: 'Failed to get payment' });
  }
};

// Create a new payment
export const createPayment = async (req, res) => {
  const { user_id, ride_id, amount, status } = req.body;
  if (!user_id || !ride_id || !amount) {
    return res.status(400).json({ error: 'Missing required fields: user_id, ride_id, and amount are required' });
  }
  try {
    const newPayment = await Payments.createPayment(user_id, ride_id, amount, status || 'pending');
    res.status(201).json(newPayment);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  } 
};

// Update a payment
export const updatePayment = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Payment ID is required' });
  }
  const { amount, status } = req.body;
  if (!amount || !status) {
    return res.status(400).json({ error: 'Missing required fields: amount and status are required' });
  }
  try {
    const updatedPayment = await Payments.updatePayment(id, amount, status);  
    if (!updatedPayment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(updatedPayment); 
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ error: 'Failed to update payment' });
  }
};

// Delete a payment
export const deletePayment = async (req, res) => {
  const { id } = req.params;  
  if (!id) {
    return res.status(400).json({ error: 'Payment ID is required' });
  }
  try {
    const deletedPayment = await Payments.deletePayment(id);  
    if (!deletedPayment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ error: 'Failed to delete payment' });
  } 
};
