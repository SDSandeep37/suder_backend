import * as Ride from '../models/rideModel.js';

//Get all rides
export const getAllRides = async (req, res) => {
    try {
      const rides = await Ride.getAllRides();
      res.json(rides);
    } catch (err) {
      console.error('Error fetching rides:', err);
      res.status(500).json({ error: 'Failed to fetch rides' });
    }
  };

  // Get a ride by ID
export const getRideById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Ride ID is required' });
    }
    try {
      const ride = await Ride.getRideById(id);
      if (!ride) {
        return res.status(404).json({ error: 'Ride not found' });
      }
      res.json(ride);
    } catch (err) {
      console.error('Error fetching ride:', err);
      res.status(500).json({ error: 'Failed to fetch ride' });
    }
  };

// Create a new ride
export const createRide = async (req, res) => {
  const { driver_id, rider_id, origin, destination, status } = req.body;
  if (!driver_id || !rider_id || !origin || !destination || !status) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const newRide = await Ride.createRide(driver_id, rider_id, origin, destination, status);
    res.status(201).json(newRide);
  } catch (err) {
    console.error('Error creating ride:', err);
    res.status(500).json({ error: 'Failed to create ride' });
  }
};

// Update a ride
export const updateRide = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Ride ID is required' });
  }
  const { origin, destination, status } = req.body;
  if (!origin || !destination || !status) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const updatedRide = await Ride.updateRide(id, origin, destination, status);
    if (!updatedRide) {
      return res.status(404).json({ error: 'Ride not found' });
    }
    res.json(updatedRide);
  } catch (err) {
    console.error('Error updating ride:', err);
    res.status(500).json({ error: 'Failed to update ride' });
  }
};

// Delete a ride
export const deleteRide = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Ride ID is required' });
  }
  try {
    const deleted = await Ride.deleteRide(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Ride not found' });
    }
    res.json({ message: 'Ride deleted successfully' });
  } catch (err) {
    console.error('Error deleting ride:', err);
    res.status(500).json({ error: 'Failed to delete ride' });
  }
};