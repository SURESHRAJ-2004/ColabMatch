import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import * as joinRequestController from '../controllers/joinRequestController.js';

const router = Router();

// POST /api/projects/:id/join — Request to join a project
router.post(
  '/projects/:id/join',
  [
    body('message').optional().trim().isLength({ max: 500 }).withMessage('Message too long (max 500 chars)'),
    validate,
  ],
  joinRequestController.createJoinRequest
);

// GET /api/projects/:id/requests — Get join requests for a project (owner)
router.get('/projects/:id/requests', joinRequestController.getProjectRequests);

// PUT /api/requests/:requestId — Accept or reject a request
router.put(
  '/requests/:requestId',
  [
    body('action').isIn(['accept', 'reject']).withMessage('Action must be "accept" or "reject"'),
    validate,
  ],
  joinRequestController.respondToRequest
);

// GET /api/requests/mine — Get current user's outgoing requests
router.get('/requests/mine', joinRequestController.getMyRequests);

export default router;
