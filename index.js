import express from 'express';
import cors from 'cors';
import { initDB } from './db.js';
import userRoutes from './routes/userRoutes.js';
import rideRoutes from './routes/rideRoutes.js';
import paymentRoutes from './routes/paymentsRoutes.js';

const app = express();
app.use('/uploads',express.static('uploads'))
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
const PORT = process.env.PORT || 3000;
app.use(express.json());
// Use user routes
app.use('/api/users', userRoutes);
// Use ride routes  
app.use('/api/rides', rideRoutes);
// Use payment routes
app.use('/api/payments', paymentRoutes);

// Initialize the database and start the server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database', err);
});