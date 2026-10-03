import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { authenticateToken } from './middleware/auth.js';
import { AppError } from './utils/errors.js';

// Route imports
import profileRoutes from './routes/profiles.js';
import skillRoutes from './routes/skills.js';
import projectRoutes from './routes/projects.js';
import joinRequestRoutes from './routes/joinRequests.js';
import matchRoutes from './routes/match.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Global Middleware ──
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Protected API Routes ──
app.use('/api/profiles', authenticateToken, profileRoutes);
app.use('/api/skills', authenticateToken, skillRoutes);
app.use('/api/projects', authenticateToken, projectRoutes);
app.use('/api', authenticateToken, joinRequestRoutes);
app.use('/api/match', authenticateToken, matchRoutes);
app.use('/api/dashboard', authenticateToken, dashboardRoutes);

// ── 404 Handler ──
app.use('/api/{*splat}', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ── Global Error Handler ──
app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal server error' });
});

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`COLABMATCH API server running on port ${PORT}`);
});

export default app;
