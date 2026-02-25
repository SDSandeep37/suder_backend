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

// create a new payment 
export const createPayment = async (user_id, ride_id, amount, status) => {
  try {
    const currentTime = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' });
    const result = await pool.query(
      'INSERT INTO payments (user_id,ride_id, amount, status,created_at,updated_at) VALUES ($1, $2, $3, $4, $5, $5) RETURNING *',
      [user_id,ride_id, amount, status || 'pending', currentTime]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Update a payment
export const updatePayment = async (id, amount, status) => {
  try {
    const currentTime = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' });
    const result = await pool.query(
      'UPDATE payments SET amount = $1, status = $2, updated_at = $3 WHERE id = $4 RETURNING *',
      [amount, status, currentTime, id]
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