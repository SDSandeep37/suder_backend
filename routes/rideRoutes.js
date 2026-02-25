import express from 'express';
import { createRide, getAllRides, getRideById,updateRide,deleteRide } from '../controllers/rideController.js';

const router = express.Router();

// Define routes for rides
router.get('/', getAllRides);
router.get('/:id', getRideById);
router.post('/', createRide);
router.put('/:id', updateRide);
router.delete('/:id', deleteRide);
export default router;