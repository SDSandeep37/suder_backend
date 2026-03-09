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

const allowedOrigins = [
  "http://localhost:3000",
  "https://suder-smart.vercel.app"
];

// app.use(cors({
//   origin: allowedOrigins,
//   methods: ["GET","POST","PUT","DELETE","OPTIONS"],
//   allowedHeaders: ["Content-Type","Authorization"],
//   credentials: true
// }));
app.use(cors());
app.options('*', cors()); // important for preflight

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// routes
app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/drivers', driverRoutes);

// start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database', err);
});