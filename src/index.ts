import express from 'express';
import cors from 'cors';
import "dotenv/config";

// Import routes
import eventsRoutes from './routes/eventsRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: '*',
}));

app.use('/api/events', eventsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});