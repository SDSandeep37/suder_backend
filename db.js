import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

// create a connection pool to the database
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// set the default timezone to Asia/Kolkata
(async () => {
  try {
    await pool.query("SET TIMEZONE TO 'Asia/Kolkata'");
    console.log('Timezone set to Asia/Kolkata');
  } catch (err) {
    console.error('Error setting timezone', err.message);
  }
})();

//run table creation query if not exists
export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      clerk_id TEXT UNIQUE NOT NULL,
      first_name TEXT,
      last_name TEXT,
      mobile TEXT,
      profile_pic TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `); 
  await pool.query(`
    CREATE TABLE IF NOT EXISTS rides  (
      id SERIAL PRIMARY KEY,
      driver_id INT REFERENCES drivers(id),
      rider_id INT REFERENCES users(id),
      pickup_address TEXT NOT NULL,
      pickup_lat DOUBLE PRECISION NOT NULL,
      pickup_lng DOUBLE PRECISION NOT NULL,
      dropoff_address TEXT NOT NULL,
      dropoff_lat DOUBLE PRECISION NOT NULL,
      dropoff_lng DOUBLE PRECISION NOT NULL,
      ride_type TEXT,
      status TEXT DEFAULT 'REQUESTED',
      distance_km DECIMAL(10,2),
      fare DECIMAL(10,2),
      start_time TIMESTAMP,
      end_time TIMESTAMP,
      cancelled_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id),
      ride_id INT REFERENCES rides(id),
      amount NUMERIC,
      status TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

      );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    vehicle_number TEXT NOT NULL,
    license_number TEXT NOT NULL,
    vehicle_type TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT false,
    current_lat DECIMAL(10,8),
    current_lng DECIMAL(11,8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('Database initialized');
};
 