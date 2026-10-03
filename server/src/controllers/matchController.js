import * as matchService from '../services/matchService.js';

export async function getRecommendedProjects(req, res, next) {
  try {
    const projects = await matchService.getRecommendedProjects(req.user.id);
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

export async function getRecommendedCollaborators(req, res, next) {
  try {
    const collaborators = await matchService.getRecommendedCollaborators(req.params.projectId);
    res.json(collaborators);
  } catch (err) {
    next(err);
  }
}
