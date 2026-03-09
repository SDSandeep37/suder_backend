// import packages
import express from 'express';
import cors from 'cors';
//import own codes
import { initDB } from './db.js';
import userRoutes from './routes/userRoutes.js';
import rideRoutes from './routes/rideRoutes.js';
import paymentRoutes from './routes/paymentsRoutes.js';
import driverRoutes from "./routes/driverRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use('/uploads',express.static('uploads'))
const allowedOrigins = [
  "http://localhost:3000",
  "https://suder-smart.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.options("*", cors());

// Use user routes
app.use('/api/users', userRoutes);
// Use ride routes  
app.use('/api/rides', rideRoutes);
// Use payment routes
app.use('/api/payments', paymentRoutes);
// use driver routes
app.use('/api/drivers',driverRoutes)

// Initialize the database and start the server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database', err);
});