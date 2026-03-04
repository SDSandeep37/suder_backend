import express from "express";
import { becomeDriver, checkDriverController, deleteDriver, getAllDrivers, getDriverById, toggleAvailability, updateDriverDetails, updateLocation, verifyDriver } from "../controllers/driverController.js";


const router = express.Router();
router.get('/',getAllDrivers);
router.get('/:id',getDriverById);
router.post('/',becomeDriver);
router.put('/verify/:id',verifyDriver);
router.put('/availability/:id', toggleAvailability);
router.put('/location/:id',updateLocation);
router.put('/:id',updateDriverDetails)
router.delete('/:id',deleteDriver);
router.get('/check/:id',checkDriverController);
export default router;