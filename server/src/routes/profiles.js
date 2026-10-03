import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import * as profileController from '../controllers/profileController.js';

const router = Router();

// GET /api/profiles/me — Get current user's profile
router.get('/me', profileController.getMyProfile);

// PUT /api/profiles/me — Update current user's profile
router.put(
  '/me',
  [
    body('full_name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('experience_level')
      .optional({ values: 'falsy' })
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Invalid experience level'),
    body('github_url').optional({ values: 'falsy' }).isURL().withMessage('Invalid GitHub URL'),
    body('linkedin_url').optional({ values: 'falsy' }).isURL().withMessage('Invalid LinkedIn URL'),
    validate,
  ],
  profileController.updateMyProfile
);

// PUT /api/profiles/me/skills — Set current user's skills
router.put(
  '/me/skills',
  [
    body('skill_ids').isArray().withMessage('skill_ids must be an array'),
    body('skill_ids.*').isInt({ min: 1 }).withMessage('Each skill_id must be a positive integer'),
    validate,
  ],
  profileController.setMySkills
);

// GET /api/profiles/:id — Get profile by ID
router.get('/:id', profileController.getProfileById);

// GET /api/profiles — Browse profiles
router.get('/', profileController.browseProfiles);

export default router;
