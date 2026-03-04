import * as Ride from '../models/rideModel.js';
import { calculateFare } from '../utils/fare.js';
import { calculateDistance } from '../utils/distance.js';
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
  const {pickup,dropoff,ride_type,rider_id} = req.body; 
  if(!pickup || !dropoff){
    return res.status(400).json({ error: "Pickup and dropoff are required" });
  }
  const { pickup_address,pickup_lat,pickup_lng} =pickup;
  const {dropoff_address,dropoff_lat,dropoff_lng } =dropoff;
  if (!rider_id ||!pickup_address || !pickup_lat ||!pickup_lng ||!dropoff_address ||!dropoff_lat ||!dropoff_lng ||!ride_type ) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const distance =  calculateDistance(pickup_lat,pickup_lng,dropoff_lat,dropoff_lng);
    const fare = calculateFare(distance);
    const newRide = await Ride.createRide(rider_id,pickup_address,pickup_lat,pickup_lng,dropoff_address,dropoff_lat,dropoff_lng,ride_type,distance,fare);
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
  const { driver_id, rider_id, status,pickup_address,pickup_lat,pickup_lng,dropoff_address,dropoff_lat,dropoff_lng,ride_type } = req.body;
  if (!driver_id ||!rider_id ||!status ||!pickup_address || !pickup_lat ||!pickup_lng ||!dropoff_address ||!dropoff_lat ||!dropoff_lng ||!ride_type) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const updatedRide = await Ride.updateRide(id, driver_id, rider_id, status,pickup_address,pickup_lat,pickup_lng,dropoff_address,dropoff_lat,dropoff_lng,ride_type);
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
// Start a ride
export const startRide= async(req,res) =>{
  const {id} = req.params;
  const {driver_id} = req.body;
  if(!id || !driver_id){
    return res.status(400).json({
      error:"Missing ride id or driver id"
    });
  }
  try {
    const ride =  await Ride.startRide(id,driver_id);
    if(!ride){
      return res.status(400).json({
        error:"Error occured while starting a ride"
      });
    }
    res.json(ride);
  } catch (error) {
    console.log("Cannot start the ride",error);
    res.status(500).json({
      error:"Failed to start ride",
      errorMessage:error.message
    });
  }
};
// Controller function to complete the ride
export const completeRide = async (req, res) => {
  const { id } = req.params;
  const { driver_id } = req.body;

  if (!id || !driver_id) {
    return res.status(400).json({ error: "Ride ID and driver_id are required" });
  }

  try {
    const ride = await Ride.completeRide(id, driver_id);

    if (!ride) {
      return res.status(400).json({ error: "Ride cannot be completed" });
    }

    res.json(ride);
  } catch (error) {
    console.log("Cannot start the ride",error);
    res.status(500).json({
      error: "Failed to complete ride",
      errorMessage:error.message
    });
  }
};

// Canceling a ride
export const cancelRide = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Ride ID is required" });
  }

  try {
    const ride = await Ride.cancelRide(id);

    if (!ride) {
      return res.status(400).json({ error: "Ride cannot be cancelled" });
    }

    res.json(ride);
  } catch (error) {
    console.error("Not able to cancel the ride",error);
    res.status(500).json({ 
      error: "Failed to cancel ride",
      errorMessage:error.message
    });
  }
};

// Assigning a ride to driver
export const assignDriver = async (req, res) => {
  const { id } = req.params;
  const { driver_id } = req.body;

  if (!id || !driver_id) {
    return res.status(400).json({ error: "Ride ID and driver_id required" });
  }

  try {
    const ride = await Ride.assignDriver(id, driver_id);

    if (!ride) {
      return res.status(409).json({ error: "Ride already accepted" });
    }

    res.json(ride);
  } catch (error) {
    res.status(500).json({ error: "Failed to assign driver" });
  }
};

// controller function to get all the rides with status REQUESTED
export const getRequestedRidesController = async (req, res) => {
  try {
    const rides = await Ride.getRequestedRides();
    res.json(rides);
  } catch (err) {
    console.error('Error fetching requested rides:', err);
    res.status(500).json({ error: 'Failed to fetch requested rides' });
  }
};
// getting the rides with driver's id
export const getRidesByDriverContoller = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Driver ID is required' });
  }
  try {
    const ride = await Ride.getRidesByDriver(id);
    if (!ride) {
      return res.status(404).json({ error: 'Rides not found' });
    }
    res.json(ride);
  } catch (err) {
    console.error('Error fetching rides:', err);
    res.status(500).json({ error: 'Failed to fetch rides' });
  }
};