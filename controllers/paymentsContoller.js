import * as Payments from '../models/paymentsModel.js';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

// check payment
export const checkPaymentsContoller = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Payment ID is required' });
  }
  try {
    const payment = await Payments.getPaymentByRideId(id);
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
  const { user_id, ride_id, amount,email,user_name} = req.body;
  const checkPayment = await Payments.getPaymentByRideId(ride_id);
  if(checkPayment && checkPayment.status ==="SUCCESS"){
    return res.status(200).json({
       paid: true,
       message:'Payment already done' 
    });
  }
  if (!user_id || !ride_id || !amount) {
    return res.status(400).json({
       error: 'Missing required fields: user_id, ride_id, and amount are required' ,
      data:req.body});
  }
  try {
    // creating stripe payment intent\
    const fare = Number(amount);
    const paymentIntent =  await stripe.paymentIntents.create({
      amount:Math.round(fare *100),
      currency: "inr",
      description:`Payment for ride ${ride_id} by ${user_name}`,
      receipt_email:email,
      automatic_payment_methods:{
        enabled:true
      },
      metadata:{
        ride_id,
        user_id
      },
      shipping:{
        name:user_name,
        address:{
            line1:"Nagri",
            city:"Ranchi",
            state:"Jharkhand",
            postal_code:"835303",
            country:"IN"
          }
      }
    });
    const newPayment = await Payments.createPayment(
      user_id, ride_id, amount,
       'PENDING',
      paymentIntent.id
    );
    res.status(201).json({
      payment: newPayment,
      clientSecret:paymentIntent.client_secret
    });
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

// confirm payment
export const confirmPayment = async (req, res) => {
  const { payment_intent_id } = req.body;

  if (!payment_intent_id) {
    return res.status(400).json({ error: "payment_intent_id required" });
  }
  try {
    // Get payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

    // Get charge using latest_charge
    const charge = await stripe.charges.retrieve(paymentIntent.latest_charge);

    const receipt_url = charge.receipt_url;

    await Payments.updatePaymentStatus(
      payment_intent_id,
      "SUCCESS",
      receipt_url
    );

    res.json({
      message: "Payment successful"
    });

  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ error: "Payment confirmation failed" });
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
