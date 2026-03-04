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
  const result = await pool.query(
    `INSERT INTO rides (rider_id, pickup_address, pickup_lat, pickup_lng, dropoff_address, dropoff_lat, dropoff_lng, ride_type,distance_km,fare)
     VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9,$10) RETURNING *`,
    [rider_id,pickup_address,pickup_lat,pickup_lng,dropoff_address,dropoff_lat,dropoff_lng,ride_type,distance,fare]
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
  const result = await pool.query(
    `UPDATE public.rides
	SET driver_id=$1, rider_id=$2, status=$3,  pickup_address=$4, pickup_lat=$5, pickup_lng=$6, dropoff_address=$7, dropoff_lat=$8, dropoff_lng=$9, ride_type=$10, updated_at=CURRENT_TIMESTAMP
	WHERE id = $11 RETURNING *`,
    [driver_id, rider_id, status,pickup_address,pickup_lat,pickup_lng,dropoff_address,dropoff_lat,dropoff_lng,ride_type, id]
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
};



// Getting all the rides by driver's id
export async function getRidesByDriver(driver_id) {
  try {
  const result = await pool.query('SELECT * FROM rides WHERE driver_id = $1 ORDER BY id DESC', [driver_id]);
  return result.rows;
  } catch (err) {
    console.error(`Error fetching rides of driver with id ${driver_id}:`, err);
    throw err;
  }
};

// Getting all the requested ride
export async function getRequestedRides() {
  try {
  const result = await pool.query(`SELECT * FROM rides WHERE status='REQUESTED'
    ORDER BY id DESC`);
  return result.rows;
  } catch (err) {
    console.error(`Error fetching requested rides of`, err);
    throw err;
  }
};


// Assigning a ride to driver or driver accepted the ride
export async function assignDriver(ride_id,driver_id){
  try{
    const result = await pool.query(
      `UPDATE rides SET driver_id=$1, status='ACCEPTED',updated_at = CURRENT_TIMESTAMP
        WHERE id =$2 AND status = 'REQUESTED' RETURNING *`,
        [driver_id,ride_id]
    );
    return result.rows[0];
  }catch(error){
    console.error('Error assigning driver:', error);
    throw error;
  }
};

// Start a ride when ride is accepted by driver
export async function startRide(ride_id,driver_id){
   try{
    const result = await pool.query(
      `UPDATE rides SET status='STARTED',start_time =CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
        WHERE id =$1 AND driver_id =$2 AND status = 'ACCEPTED' RETURNING *`,
        [ride_id,driver_id]
    );
    return result.rows[0];
  }catch(error){
    console.error('Error starting the ride:', error);
    throw error;
  }
};

// Complete the ride only if it is stated 
export async function completeRide(ride_id,driver_id){
   try{
    const result = await pool.query(
      `UPDATE rides SET status='COMPLETED',end_time=CURRENT_TIMESTAMP,updated_at = CURRENT_TIMESTAMP
        WHERE id =$1 AND driver_id =$2 AND status = 'STARTED' RETURNING *`,
        [ride_id,driver_id]
    );
    return result.rows[0];
  }catch(error){
    console.error('Error completing the ride:', error);
    throw error;
  }
};

// Cancel a ride if and only if status is requested or accepted
export async function cancelRide(ride_id) {
  try {
    const result = await pool.query(
      `UPDATE rides
       SET status = 'CANCELLED',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       AND status IN ('REQUESTED', 'ACCEPTED')
       RETURNING *`,
      [ride_id]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error cancelling the ride:", error);
    throw error;
  }
}