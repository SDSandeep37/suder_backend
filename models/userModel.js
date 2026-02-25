import { pool } from "../db.js";

//Function to get all the users from the database
export async function getAllUsers() {
  try {
  const result = await pool.query('SELECT * FROM users ORDER BY id DESC');
  return result.rows;
  } catch (error) {
    throw error;
  }
};

//Function to get a user by id from the database
export async function getUserById(id) {
  try {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
  } catch (error) {
    throw error;
  }
}

//Function to create a new user in the database
export async function createUser(email, first_name, last_name, mobile, profile_picture) {
  try {
  const currentTime = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' });
  // return currentTime;
  const result = await pool.query(
    `INSERT INTO users (email, first_name, last_name, mobile, profile_picture, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [email, first_name, last_name, mobile, profile_picture, currentTime, currentTime]

  );
  return result.rows[0];
  } catch (error) {
    throw error;
  }
}

//Function to update a user in the database
export async function updateUser(id,  first_name, last_name, mobile, profile_picture) {
  try{  
  const currentTime = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' });
  const result = await pool.query(
    `UPDATE users SET  first_name = $1, last_name = $2, mobile = $3, profile_picture = $4, updated_at = $5 WHERE id = $6 RETURNING *`,
    [first_name, last_name, mobile, profile_picture, currentTime, id]
  );
  return result.rows[0];
  } catch (error) {
    throw error;
  }
}

// Function to delete a user from the database
export async function deleteUser(id) {
  try { 
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
  } catch (error) {
    throw error;
  }
};