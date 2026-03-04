import { pool } from "../db.js";

// Get all drivers
export async function allDrivers() {
  try {
    const result = await pool.query('SELECT * FROM drivers ORDER BY id DESC');
    return result.rows;
  } catch (error) {
    console.error('Error fetching all drivers',error);
    throw error;
  }
};

// Get a driver by its id
export async function oneDriver(id) {
  try {
    const result = await pool.query("SELECT * FROM drivers WHERE id = $1",[id]);
     if(result.rowCount=== 0) return false;
     return result.rows[0];
  } catch (error) {
    console.error(`Error fetching driver details with id ${id}`,error);
    throw error;
  }
  
};

export async function createDriver(
  user_id,
  vehicle_number,
  vehicle_type,
  license_number
) {
  try {
    const currentTime =  new Date().toLocaleString(
      'en-GB',{timeZone:'Asia/Kolkata'}
    );
    const result = await pool.query(
      `INSERT INTO drivers(
      user_id, vehicle_number, vehicle_type, license_number, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $5) RETURNING *`,
      [user_id,vehicle_number,vehicle_type,license_number,currentTime]
    );
    return result.rows[0];

  } catch (error) {
    console.error('Error creating dirver',error.message);
    throw error;
  }
}

// Update an existing driver details
export async function updateDriver(
  id,
  vehicle_number,
  vehicle_type,
  license_number
){
  try {
    const currentTime =  new Date().toLocaleString(
      'en-GB',{timeZone:'Asia/Kolkata'}
    );
    const result =  await pool.query(
      `UPDATE drivers
      SET vehicle_number=$1, vehicle_type=$2, license_number=$3,updated_at=$4
      WHERE id = $5 RETURNING *`,
      [vehicle_number,vehicle_type,license_number,currentTime,id]
    );
    return result.rows[0];
  } catch (error) {
    console.error(`Error updating driver details with id ${id}`,error);
    throw error;
  }
}

// Verify Driver
export async function verifyDriver(
  id,
){
  try {
    const currentTime =  new Date().toLocaleString(
      'en-GB',{timeZone:'Asia/Kolkata'}
    );
    const driver = await oneDriver(id);
    const verification =  driver.is_verified;
    const verificationResult =  !verification ? true : false
    const result =  await pool.query(
      `UPDATE drivers
      SET is_verified=$1, updated_at=$2
      WHERE id = $3 RETURNING *`,
      [verificationResult,currentTime,id]
    );
    return result.rows[0];
  } catch (error) {
    console.error(`Error verifying driver details with id ${id}`,error);
    throw error;
  }
}

// Driver availability
export async function toggleDriverAvailability(
  id,
){
  try {
    const currentTime =  new Date().toLocaleString(
      'en-GB',{timeZone:'Asia/Kolkata'}
    );
    const driver = await oneDriver(id);
    const availability =  driver.is_available;
    const availabilityResult =  !availability; 
    // const availabilityResult =  !availability ? true : false; //same works as line number 108

    const result =  await pool.query(
      `UPDATE drivers
      SET is_available=$1, updated_at=$2
      WHERE id = $3 RETURNING *`,
      [availabilityResult,currentTime,id]
    );
    return result.rows[0];
  } catch (error) {
    console.error(`Error updating driver's availablity details with id ${id}`,error);
    throw error;
  }
};

// Updating Current Location
export async function updateDriverLocation(
  id,
  current_lat,
  current_lng
){
  try {
    const currentTime =  new Date().toLocaleString(
      'en-GB',{timeZone:'Asia/Kolkata'}
    );
    
    const result =  await pool.query(
      `UPDATE drivers
      SET current_lat=$1,current_lng=$2, updated_at=$3
      WHERE id = $4 RETURNING *`,
      [current_lat,current_lng,currentTime,id]
    );
    return result.rows[0];
  } catch (error) {
    console.error(`Error updating driver's availablity details with id ${id}`,error);
    throw error;
  }
};

// Delete a driver's details
export async function deleteDriver(id){
  try {
    const result = await pool.query('DELETE FROM drivers WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (error) {
    console.error(`Error deteting the details of driver with id ${id}`,error);
    throw error;
  }
};

// Check if a user is driver or not
export async function checkDriver(id) {
  try {
    const result = await pool.query("SELECT * FROM drivers WHERE user_id = $1",[id]);
     if(result.rowCount=== 0) return false;
     return result.rows[0];
  } catch (error) {
    console.error(`Error fetching driver details with id ${id}`,error);
    throw error;
  }
  
};