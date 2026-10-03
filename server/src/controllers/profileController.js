import * as profileService from '../services/profileService.js';

export async function getMyProfile(req, res, next) {
  try {
    const profile = await profileService.getProfileById(req.user.id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

export async function updateMyProfile(req, res, next) {
  try {
    const profile = await profileService.updateProfile(req.user.id, req.body);
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

export async function getProfileById(req, res, next) {
  try {
    const profile = await profileService.getProfileById(req.params.id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

export async function browseProfiles(req, res, next) {
  try {
    const { search, skills, page, limit } = req.query;
    const skillIds = skills ? skills.split(',').map(Number) : undefined;
    const result = await profileService.browseProfiles({
      search,
      skillIds,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function setMySkills(req, res, next) {
  try {
    const { skill_ids } = req.body;
    const skills = await profileService.setProfileSkills(req.user.id, skill_ids || []);
    res.json({ skills });
  } catch (err) {
    next(err);
  }
}
