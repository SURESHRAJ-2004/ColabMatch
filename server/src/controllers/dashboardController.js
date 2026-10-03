import * as dashboardService from '../services/dashboardService.js';

export async function getDashboard(req, res, next) {
  try {
    const data = await dashboardService.getDashboardData(req.user.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
