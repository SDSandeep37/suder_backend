import express from 'express';
import cors from 'cors';

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

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));   // 👈 important fix

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/drivers', driverRoutes);

app.use((err, req, res, next) => {
  console.error("Global error:", err);

  res.header("Access-Control-Allow-Origin", "https://suder-smart.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");

  res.status(500).json({
    error: err.message || "Server error"
  });
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database', err);
});