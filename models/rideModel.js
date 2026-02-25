import { pool } from "../db.js";

// Get all rides
export async function getAllRides() {
  try {
  const result = await pool.query('SELECT * FROM rides ORDER BY id DESC');
  return result.rows;
} catch (err) {
  console.error('Error fetching rides:', err);
  throw err;
}
}

// Get a ride by ID
export async function getRideById(id) {
  try {
  const result = await pool.query('SELECT * FROM rides WHERE id = $1', [id]);
  return result.rows[0];
} catch (err) {
  console.error(`Error fetching ride with id ${id}:`, err);
  throw err;
}
}

// Create a new ride
export async function createRide(driver_id,rider_id,origin, destination, status) {
  try {
  const currentTime = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' });
  const result = await pool.query(
    `INSERT INTO rides (driver_id, rider_id, origin, destination, status, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $6) RETURNING *`,
    [driver_id, rider_id,origin, destination, status, currentTime]
  );
  return result.rows[0];
} catch (err) {
  console.error('Error creating ride:', err.message);
  throw err;
}
}
// Update an existing ride
export async function updateRide(id, origin, destination, status) {
  try {
  const currentTime = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' });
  const result = await pool.query(
    `UPDATE rides SET origin = $1, destination = $2, status = $3, updated_at = $4 WHERE id = $5 RETURNING *`,
    [origin, destination, status, currentTime, id]
  );
  return result.rows[0];
} catch (err) {
  console.error(`Error updating ride with id ${id}:`, err);
  throw err;
}
}
// Delete a ride
export async function deleteRide(id) {
  try {
  const result = await pool.query('DELETE FROM rides WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
} catch (err) {
  console.error(`Error deleting ride with id ${id}:`, err);
  throw err;
}
}
  