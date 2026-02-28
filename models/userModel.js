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
export async function createUser(email, first_name, last_name, mobile, profile_picture,clerk_id) {
  try {
    clerk_id = clerk_id?clerk_id:""; // Set clerk_id to blank if it's undefined
  const currentTime = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' });
  // return currentTime;
  const result = await pool.query(
    `INSERT INTO users (email, first_name, last_name, mobile, profile_pic, clerk_id, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [email, first_name, last_name, mobile, profile_picture, clerk_id,  currentTime, currentTime]

  );
  return result.rows[0];
  } catch (error) {
    throw error;
  }
}


// Function synch user data from Clerk to the database
export async function syncUserData(clerk_id, email, first_name, last_name, mobile, profile_picture) {
  try {
    // Check if the user already exists in the database
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      // If the user exists, update their information
      const user = existingUser.rows[0];
      //If mobile is not in clerk then set it with the details in database
      mobile = mobile?mobile:user.mobile;
      const updatedUser = await updateUser(user.id, first_name, last_name, mobile);
      return updatedUser;
    } else {
      // If the user does not exist, create a new user
      const newUser = await createUser(email, first_name, last_name, mobile, profile_picture,clerk_id);
      return newUser;
    }
  } catch (error) {
    throw error;
  }
}
//Function to update a user in the database
export async function updateUser(id,  first_name, last_name, mobile) {
  try{  
    // clerk_id = clerk_id?clerk_id:""; // Set clerk_id to blank if it's undefined
  const currentTime = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' });
  const result = await pool.query(
    `UPDATE users SET  first_name = $1, last_name = $2, mobile = $3, updated_at = $4 WHERE id = $5 RETURNING *`,
    [first_name, last_name, mobile, currentTime, id]
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

// Function only to update the profile_pic
export async function updateProfilePic(id,fileUrl){
  try{
    const result = await pool.query("UPDATE users SET profile_pic= $1  WHERE id=$2",[fileUrl,id]);
    return true;
  }catch(error){
    throw error;
  }
}