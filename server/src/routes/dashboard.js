import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController.js';

const router = Router();

// GET /api/dashboard — Aggregated dashboard data
router.get('/', dashboardController.getDashboard);

export default router;
