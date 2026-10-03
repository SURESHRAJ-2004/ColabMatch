import * as projectService from '../services/projectService.js';

export async function createProject(req, res, next) {
  try {
    const project = await projectService.createProject(req.user.id, req.body);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

export async function getProject(req, res, next) {
  try {
    const project = await projectService.getProjectById(req.params.id);
    res.json(project);
  } catch (err) {
    next(err);
  }
}

export async function listProjects(req, res, next) {
  try {
    const { search, category, status, skills, page, limit } = req.query;
    const skillIds = skills ? skills.split(',').map(Number) : undefined;
    const result = await projectService.listProjects({
      search,
      category,
      status,
      skillIds,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 12,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req, res, next) {
  try {
    const project = await projectService.updateProject(req.params.id, req.user.id, req.body);
    res.json(project);
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(req, res, next) {
  try {
    const result = await projectService.deleteProject(req.params.id, req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getMembers(req, res, next) {
  try {
    const members = await projectService.getProjectMembers(req.params.id);
    res.json(members);
  } catch (err) {
    next(err);
  }
}

export async function removeMember(req, res, next) {
  try {
    const result = await projectService.removeMember(req.params.id, req.params.profileId, req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
