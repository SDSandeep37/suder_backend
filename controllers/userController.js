import * as User from "../models/userModel.js";

// Get all users
export async function getAllUsers(req, res) {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users', err);
    res.status(500).json({ error: `Internal Server Error: ${err.message}` });
  }
}

// Get user by id
export async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const user = await User.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user by id', err);
    res.status(500).json({ error: `Internal Server Error: ${err.message}` });
  }
}
// Create a new user
export async function createUser(req, res) {
  const { email, first_name, last_name } = req.body;
  if(!email){
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    const user = await User.createUser(email, first_name, last_name);
    res.status(201).json(user);
  } catch (err) {
    console.error('Error creating user', err);
    res.status(500).json({ error: `Internal Server Error: ${err.message}` });
  }
}
// Update existing user
export async function updateUser(req, res) {
  try {   
    const { id } = req.params;
    const { first_name, last_name } = req.body;
    const user = await User.updateUser(id, first_name, last_name);
    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error updating user', err);
    res.status(500).json({ error: `Internal Server Error: ${err.message}` });
  }
}

// Delete existing user
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.deleteUser(id);
    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }
    res.json({ message: 'User deleted successfully' });
  }catch (err) {
    console.error('Error deleting user', err);
    res.status(500).json({ error: `Internal Server Error: ${err.message}` });
  }
}