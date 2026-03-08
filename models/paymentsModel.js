import { pool } from "../db.js";

// Get all payments
export const getAllPayments = async () => {
  try {
    const result = await pool.query("SELECT * FROM payments ORDER BY id DESC");
    return result.rows; // returns [] if no payments
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }

};
// Get a payment by ID
export const getPaymentById = async (id) => {
  try { 
    const result = await pool.query('SELECT * FROM payments WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    throw error;
  } 
};
// Get a payment by ride_id
export const getPaymentByRideId = async (ride_id) => {
  const result = await pool.query(`SELECT * FROM payments WHERE ride_id = $1 AND status='SUCCESS'`, [ride_id]);
  return result.rows[0];
  
};

// create a new payment 
export const createPayment = async (user_id, ride_id, amount, status,payment_intent_id) => {
 
  try {
    const platformFee = amount * 0.10;
    const driverPayout = amount - platformFee;
    const result = await pool.query(
    `INSERT INTO payments
    (user_id, ride_id, amount, currency, payment_method, platform_fee, driver_payout, status, stripe_payment_intent)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *`,
    [
      user_id,
      ride_id,
      amount,
      "INR",
      "CARD",
      platformFee,
      driverPayout,
      status,
      payment_intent_id
    ]
  );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};
// Update payment amount/status
export const updatePayment = async (id, amount, status) => {
  try {
    const currentTime = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' });
    const result = await pool.query(
      'UPDATE payments SET amount = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [amount, status, id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// cConfirm payment using Stripe payment intent
export const updatePaymentStatus = async (payment_intent_id, status,receipt_url) => {
  try {
    const currentTime = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' });
    const result = await pool.query(
      `UPDATE payments SET status = $1,receipt_url=$2, updated_at =CURRENT_TIMESTAMP
       WHERE stripe_payment_intent= $3
       RETURNING *`,
      [status,receipt_url,payment_intent_id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Delete a payment
export const deletePayment = async (id) => {
  try {
    const result = await pool.query('DELETE FROM payments WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};