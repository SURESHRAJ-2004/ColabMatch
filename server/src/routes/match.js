import { Router } from 'express';
import * as matchController from '../controllers/matchController.js';

const router = Router();

// GET /api/match/projects — Recommended projects for current user
router.get('/projects', matchController.getRecommendedProjects);

// GET /api/match/collaborators/:projectId — Recommended collaborators for a project
router.get('/collaborators/:projectId', matchController.getRecommendedCollaborators);

export default router;
