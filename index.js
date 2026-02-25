import express from 'express';
import { initDB } from './db.js';
import userRoutes from './routes/userRoutes.js';
import rideRoutes from './routes/rideRoutes.js';
import paymentRoutes from './routes/paymentsRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
// Use user routes
app.use('/users', userRoutes);
// Use ride routes  
app.use('/rides', rideRoutes);
// Use payment routes
app.use('/payments', paymentRoutes);

// Initialize the database and start the server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database', err);
});