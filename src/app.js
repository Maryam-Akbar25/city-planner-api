//(Main entry point for the City Planner API, setting up Express app, routes, and middlewares,
// wiring everything together)
import express from 'express';
import logger from './middlewares/logger.js';
import errorHandler from './middlewares/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import planRoutes from './routes/planRoutes.js';

const app = express();

// Global Middlewares
app.use(express.json());
app.use(logger);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'City Planner API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);  

// 404 Handler for unmatched routes/unknown visitors
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found.` });
});

// Centralized Error Handler (must be last)
app.use(errorHandler);

export default app;