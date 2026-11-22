import express from 'express';

const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'City Planner API is running' });
});

export default app;