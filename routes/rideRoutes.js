import express from 'express';
import { createRide, getAllRides, getRideById,updateRide,deleteRide, assignDriver, startRide, completeRide, cancelRide, getRequestedRidesController, getRidesByDriverContoller, getDriverDashboardController, getRecentTripsController, getDriverRidesAllDashboardController } from '../controllers/rideController.js';

const router = express.Router();

// Routes for rides
router.get('/requested',getRequestedRidesController);
router.get('/', getAllRides);
router.get('/:id', getRideById);
router.post('/', createRide);
router.put('/:id', updateRide);
router.delete('/:id', deleteRide);

router.get('/:id/driver',getRidesByDriverContoller);
router.get('/:id/driver/dashboard',getDriverDashboardController);
router.get('/:id/driver/recent',getRecentTripsController);
router.get('/:id/driver/all',getDriverRidesAllDashboardController)
// Routes for ride lifecycle
router.put('/:id/accept', assignDriver);
router.put('/:id/start', startRide);
router.put('/:id/complete', completeRide);
router.put('/:id/cancel', cancelRide);
export default router;