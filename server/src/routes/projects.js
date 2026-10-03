import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import * as projectController from '../controllers/projectController.js';

const router = Router();

// POST /api/projects — Create project
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().trim(),
    body('category').optional().trim(),
    body('team_size').optional().isInt({ min: 2, max: 20 }).withMessage('Team size must be 2-20'),
    body('skill_ids').optional().isArray().withMessage('skill_ids must be an array'),
    validate,
  ],
  projectController.createProject
);

// GET /api/projects — List/search projects
router.get('/', projectController.listProjects);

// GET /api/projects/:id — Get project details
router.get('/:id', projectController.getProject);

// PUT /api/projects/:id — Update project
router.put(
  '/:id',
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('status')
      .optional()
      .isIn(['open', 'in_progress', 'completed'])
      .withMessage('Invalid status'),
    body('team_size').optional().isInt({ min: 2, max: 20 }).withMessage('Team size must be 2-20'),
    validate,
  ],
  projectController.updateProject
);

// DELETE /api/projects/:id — Delete project
router.delete('/:id', projectController.deleteProject);

// GET /api/projects/:id/members — List project members
router.get('/:id/members', projectController.getMembers);

// DELETE /api/projects/:id/members/:profileId — Remove member
router.delete('/:id/members/:profileId', projectController.removeMember);

export default router;
