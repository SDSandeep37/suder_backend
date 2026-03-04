import * as Driver from "../models/driverModel.js";


//  Get All Drivers
export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.allDrivers();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ 
      error: "Failed to fetch drivers",
      errorMessage:error
   });
  }
};



// Get Driver By ID
export const getDriverById = async (req, res) => {
  const { id } = req.params;

  try {
    const driver = await Driver.oneDriver(id);
    
    if (!driver) {
      return res.status(404).json({ 
        error: "Driver not found"
      });
    }else{

      res.status(200).json(driver);
    }

  } catch (error) {
    res.status(500).json({ error: "Failed to fetch driver",
        errorMessage:error
      });
  }
};



//  Become Driver
export const becomeDriver = async (req, res) => {
  try {
    const { user_id,vehicle_number, vehicle_type, license_number } = req.body;
    if(!user_id){
      return res.status(400).json({
        error:"User id required"
      });
    }

    if (!vehicle_number || !vehicle_type || !license_number) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const driver = await Driver.createDriver(
      user_id,
      vehicle_number,
      vehicle_type,
      license_number
    );

    res.status(201).json(driver);
  } catch (error) {
    res.status(500).json({ error: "Failed to register driver",
        errorMessage:error
      });
  }
};



//  Update Driver Details
export const updateDriverDetails = async (req, res) => {
  const { id } = req.params;
  const { vehicle_number, vehicle_type, license_number } = req.body;

  try {
    const updatedDriver = await Driver.updateDriver(
      id,
      vehicle_number,
      vehicle_type,
      license_number
    );

    if (!updatedDriver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    res.status(200).json(updatedDriver);
  } catch (error) {
    res.status(500).json({ error: "Failed to update driver",
        errorMessage:error
      });
  }
};



//  Verify Driver (Admin Action)
export const verifyDriver = async (req, res) => {
  const { id } = req.params;

  try {
    const driver = await Driver.verifyDriver(id);

    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ error: "Failed to verify driver",
        errorMessage:error
      });
  }
};



// Toggle Driver Availability
export const toggleAvailability = async (req, res) => {
  const { id } = req.params;

  try {
    const driver = await Driver.toggleDriverAvailability(id);

    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ error: "Failed to update availability" ,
        errorMessage:error
      });
  }
};



// Update Driver Location
export const updateLocation = async (req, res) => {
  const { id } = req.params;
  const { current_lat, current_lng } = req.body;

  if (!current_lat || !current_lng) {
    return res.status(400).json({ error: "Location required" });
  }

  try {
    const driver = await Driver.updateDriverLocation(
      id,
      current_lat,
      current_lng
    );

    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    res.status(200).json(driver);
  } catch (error) {
    res.status(500).json({ error: "Failed to update location" ,
        errorMessage:error
      });
  }
};



// Delete Driver
export const deleteDriver = async (req, res) => {
  const { id } = req.params;

  try {
    const driver = await Driver.deleteDriver(id);

    if (!driver) {
      return res.status(404).json({ error: "Driver not found" });
    }

    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete driver" ,
        errorMessage:error
      });
  }
};

// Check the driver
export const checkDriverController = async (req, res) => {
  const { id } = req.params;

  try {
    const driver = await Driver.checkDriver(id);

    if (!driver) {
      return res.status(200).json({
        success: true,
        isDriver: false
      });
    }

    return res.status(200).json({
      success: true,
      isDriver: true,
      driver
    });

  } catch (error) {
    console.error("Check Driver Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while checking driver"
    });
  }
};
