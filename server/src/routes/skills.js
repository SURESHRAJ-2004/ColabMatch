import { Router } from 'express';
import * as skillController from '../controllers/skillController.js';

const router = Router();

// GET /api/skills — List all skills
router.get('/', skillController.getAllSkills);

export default router;
