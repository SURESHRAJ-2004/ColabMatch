import 'dotenv/config';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Global Middleware ──
app.use(helmet({ contentSecurityPolicy: false }));
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

// ── Serve Client UI in Production or when built ──
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// ── 404 Handler for API ──
app.use('/api/{*splat}', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ── SPA Fallback for all other routes ──
app.get('{*splat}', (req, res, next) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  next();
});

// ── Global Error Handler ──
app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  res.status(500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : (err.message || 'Internal server error'),
  });
});

// ── Start Server ──
app.listen(PORT, () => {
  console.log(`COLABMATCH API server running on port ${PORT}`);
});

export default app;
