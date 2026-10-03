import * as skillService from '../services/skillService.js';

export async function getAllSkills(req, res, next) {
  try {
    const skills = await skillService.getAllSkills();
    res.json(skills);
  } catch (err) {
    next(err);
  }
}
