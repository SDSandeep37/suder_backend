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
export async function createRide(rider_id,pickup_address,pickup_lat,pickup_lng,dropoff_address,dropoff_lat,dropoff_lng,ride_type,distance,fare) {
  try {
  const currentTime = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' });
  const result = await pool.query(
    `INSERT INTO rides (rider_id, pickup_address, pickup_lat, pickup_lng, dropoff_address, dropoff_lat, dropoff_lng, ride_type,distance_km,fare, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9,$10,$11,$11) RETURNING *`,
    [rider_id,pickup_address,pickup_lat,pickup_lng,dropoff_address,dropoff_lat,dropoff_lng,ride_type,distance,fare,currentTime]
  );
  return result.rows[0];
} catch (err) {
  console.error('Error creating ride:', err.message);
  throw err;
}
}
// Update an existing ride
export async function updateRide(id, driver_id, rider_id, status,pickup_address,pickup_lat,pickup_lng,dropoff_address,dropoff_lat,dropoff_lng,ride_type) {
  try {
  const currentTime = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' });
  const result = await pool.query(
    `UPDATE public.rides
	SET driver_id=$1, rider_id=$2, status=$3,  pickup_address=$4, pickup_lat=$5, pickup_lng=$6, dropoff_address=$7, dropoff_lat=$8, dropoff_lng=$9, ride_type=$10,created_at=$11, updated_at=$11
	WHERE id = $12 RETURNING *`,
    [driver_id, rider_id, status,pickup_address,pickup_lat,pickup_lng,dropoff_address,dropoff_lat,dropoff_lng,ride_type, currentTime, id]
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
  