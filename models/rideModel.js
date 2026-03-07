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
export async function cancelRide(ride_id,user_id) {
  try {
    const result = await pool.query(
      `UPDATE rides
       SET status = 'CANCELLED',
           updated_at = CURRENT_TIMESTAMP,
           cancelled_by =$2
       WHERE id = $1
       AND (driver_id = $2 OR rider_id= $2)
       AND status IN ('REQUESTED', 'ACCEPTED')
       RETURNING *`,
      [ride_id,user_id]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error cancelling the ride:", error);
    throw error;
  }
};


export const getDriverDashboard = async (driver_id) => {

  const query = `
    SELECT 
      COUNT(*) AS total_rides,

      COUNT(*) FILTER (
        WHERE DATE(created_at AT TIME ZONE 'Asia/Kolkata') =
        DATE(NOW() AT TIME ZONE 'Asia/Kolkata')
      ) AS today_rides,

      COUNT(*) FILTER (
        WHERE status = 'COMPLETED'
      ) AS completed_rides,

      COUNT(*) FILTER (
        WHERE status = 'STARTED'
      ) AS active_rides,

      COALESCE(SUM(fare) FILTER (
        WHERE status = 'COMPLETED'
        AND DATE(created_at AT TIME ZONE 'Asia/Kolkata') =
        DATE(NOW() AT TIME ZONE 'Asia/Kolkata')
      ),0) AS today_earnings

    FROM rides
    WHERE driver_id = $1
  `;
  try {
    const result = await pool.query(query, [driver_id]);

  return result.rows[0];
  } catch (error) {
    console.error("Error fetching dashboard details:", error);
    throw error;
  }
  
};
// Get all the recent trips done by a driver with rider's details
export async function getAllRecentTrips(driver_id) {
  try {
    const result = await pool.query(
      `SELECT rides.id,rides.driver_id,rides.rider_id,
      rides.pickup_address AS pickuppoint,
      rides.dropoff_address AS droppoint, rides.fare,
      users.first_name,users.last_name FROM rides JOIN 
      users ON rides.rider_id =  users.id WHERE rides.driver_id =  $1`
      ,[driver_id]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching recent rides:", error);
    throw error;
  }
};

// all the rides which are not assigned to driver and assigned to a particular driver
export async function getDriverRidesAllDashboard(driver_id){
  try {

    const availableRides = await pool.query(
      `SELECT rides.id,rides.driver_id,rides.rider_id,rides.status,
      rides.pickup_address,rides.dropoff_address,rides.distance_km,rides.fare,
      users.first_name,users.last_name,users.email,users.mobile
      FROM rides JOIN 
      users ON rides.rider_id =  users.id 
      WHERE rides.status = 'REQUESTED' 
      AND rides.driver_id IS NULL
      ORDER BY rides.created_at DESC`
    );

    const driverRides = await pool.query(
      `SELECT rides.id,rides.driver_id,rides.rider_id,rides.status,
      rides.pickup_address,rides.dropoff_address,rides.distance_km,rides.fare,
      users.first_name,users.last_name,users.email,users.mobile
      FROM rides JOIN 
      users ON rides.rider_id =  users.id 
      WHERE  (rides.driver_id=$1 OR rides.cancelled_by::INT=$1)
      ORDER BY rides.created_at DESC`,
      [driver_id]
    );

    return {
      availableRides: availableRides.rows,
      driverRides: driverRides.rows,
      availableRidesCount:availableRides.rowCount,
      driverRidesCount:driverRides.rowCount
    };

  } catch (error) {
    console.error("Error fetching rides:", error);
    throw error;
  }
};


//getting all the rides related to a particular user/rider
export async function getRiderRidesAllDashboard(user_id){
  try {

    const currentRides = await pool.query(
      `SELECT rides.id,rides.driver_id,rides.rider_id,rides.status,
      rides.pickup_address,rides.dropoff_address,rides.distance_km,rides.fare,
      users.first_name,users.last_name,users.email,users.mobile
      FROM rides JOIN 
      users ON rides.rider_id =  users.id 
      WHERE rides.status IN ('REQUESTED','ACCEPTED','STARTED')
	    AND users.id = $1
      ORDER BY rides.created_at DESC`,[user_id]
    );
    const startedRides = await pool.query(
      `SELECT rides.id,rides.driver_id,rides.rider_id,rides.status,
      rides.pickup_address,rides.dropoff_address,rides.distance_km,rides.fare,
      users.first_name,users.last_name,users.email,users.mobile
      FROM rides JOIN 
      users ON rides.rider_id =  users.id 
      WHERE rides.status ='STARTED'
	    AND rides.rider_id = $1
      ORDER BY rides.created_at DESC`,[user_id]
    );

    const allRides = await pool.query(
      `SELECT rides.id,rides.driver_id,rides.rider_id,rides.status,
      rides.pickup_address,rides.dropoff_address,rides.distance_km,rides.fare,
      users.first_name,users.last_name,users.email,users.mobile
      FROM rides JOIN 
      users ON rides.rider_id =  users.id 
      WHERE  (rides.rider_id=$1 OR rides.cancelled_by::INT=$1)
      ORDER BY rides.created_at DESC`,
      [user_id]
    );
    const query = `
    SELECT 
      COUNT(*) AS total_rides,

      COUNT(*) FILTER (
        WHERE DATE(created_at AT TIME ZONE 'Asia/Kolkata') =
        DATE(NOW() AT TIME ZONE 'Asia/Kolkata')
      ) AS today_rides,

      COUNT(*) FILTER (
        WHERE status = 'COMPLETED'
      ) AS completed_rides,

      COUNT(*) FILTER (
        WHERE status = 'STARTED'
      ) AS active_rides,

      COALESCE(SUM(fare) FILTER (
        WHERE status = 'COMPLETED'
        AND DATE(created_at AT TIME ZONE 'Asia/Kolkata') =
        DATE(NOW() AT TIME ZONE 'Asia/Kolkata')
      ),0) AS today_expenses

    FROM rides
    WHERE rider_id = $1
  `;
  const result = await pool.query(query, [user_id]);
    return {
      currentRides: currentRides.rows,
      allRides: allRides.rows,
      startedRides: startedRides.rows,
      currentRidesCount:currentRides.rowCount,
      allRidesCount:allRides.rowCount,
      startedRidesCount:startedRides.rowCount,
      otherRidesCount:result.rows[0]
    };

  } catch (error) {
    console.error("Error fetching rides:", error);
    throw error;
  }
};