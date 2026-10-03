import supabase from '../config/supabase.js';

/**
 * Get recommended projects for a user based on skill overlap.
 *
 * Algorithm: matchScore = (overlapping skills / required project skills) × 100
 */
export async function getRecommendedProjects(userId) {
  // 1. Get user's skill IDs
  const { data: userSkillRows } = await supabase
    .from('profile_skills')
    .select('skill_id')
    .eq('profile_id', userId);

  const userSkillIds = (userSkillRows || []).map((r) => r.skill_id);

  if (userSkillIds.length === 0) {
    return [];
  }

  // 2. Get open projects the user is NOT a member of
  const { data: memberOf } = await supabase
    .from('project_members')
    .select('project_id')
    .eq('profile_id', userId);

  const memberProjectIds = (memberOf || []).map((m) => m.project_id);

  let query = supabase
    .from('projects')
    .select('*, profiles!owner_id(id, full_name, avatar_url)')
    .eq('status', 'open');

  if (memberProjectIds.length > 0) {
    query = query.not('id', 'in', `(${memberProjectIds.join(',')})`);
  }

  const { data: projects } = await query;

  if (!projects || projects.length === 0) return [];

  // 3. Get all project skills for these projects
  const projectIds = projects.map((p) => p.id);
  const { data: allProjectSkills } = await supabase
    .from('project_skills')
    .select('project_id, skill_id, skills(id, name)')
    .in('project_id', projectIds);

  const projectSkillMap = {};
  const projectSkillObjMap = {};
  for (const ps of allProjectSkills || []) {
    if (!projectSkillMap[ps.project_id]) projectSkillMap[ps.project_id] = [];
    if (!projectSkillObjMap[ps.project_id]) projectSkillObjMap[ps.project_id] = [];
    projectSkillMap[ps.project_id].push(ps.skill_id);
    projectSkillObjMap[ps.project_id].push(ps.skills);
  }

  // 4. Calculate match scores
  const scored = projects.map((project) => {
    const requiredSkillIds = projectSkillMap[project.id] || [];
    project.skills = projectSkillObjMap[project.id] || [];
    project.owner = project.profiles;
    delete project.profiles;

    if (requiredSkillIds.length === 0) {
      return { ...project, match_score: 0, matching_skills: [] };
    }

    const overlap = requiredSkillIds.filter((s) => userSkillIds.includes(s));
    const score = Math.round((overlap.length / requiredSkillIds.length) * 100);

    const matchingSkills = project.skills.filter((s) => userSkillIds.includes(s.id));

    return { ...project, match_score: score, matching_skills: matchingSkills };
  });

  // 5. Sort by score descending, filter out 0%
  return scored
    .filter((p) => p.match_score > 0)
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 20);
}

/**
 * Get recommended collaborators for a project based on skill overlap.
 */
export async function getRecommendedCollaborators(projectId) {
  // 1. Get project's required skill IDs
  const { data: projectSkillRows } = await supabase
    .from('project_skills')
    .select('skill_id, skills(id, name)')
    .eq('project_id', projectId);

  const requiredSkillIds = (projectSkillRows || []).map((r) => r.skill_id);
  const requiredSkillObjects = (projectSkillRows || []).map((r) => r.skills);

  if (requiredSkillIds.length === 0) {
    return [];
  }

  // 2. Get existing members
  const { data: members } = await supabase
    .from('project_members')
    .select('profile_id')
    .eq('project_id', projectId);

  const memberIds = (members || []).map((m) => m.profile_id);

  // 3. Get all profiles NOT already members
  let query = supabase
    .from('profiles')
    .select('id, full_name, avatar_url, college, experience_level');

  if (memberIds.length > 0) {
    query = query.not('id', 'in', `(${memberIds.join(',')})`);
  }

  const { data: profiles } = await query;

  if (!profiles || profiles.length === 0) return [];

  // 4. Get skills for all candidate profiles
  const profileIds = profiles.map((p) => p.id);
  const { data: allProfileSkills } = await supabase
    .from('profile_skills')
    .select('profile_id, skill_id, skills(id, name)')
    .in('profile_id', profileIds);

  const profileSkillMap = {};
  const profileSkillObjMap = {};
  for (const ps of allProfileSkills || []) {
    if (!profileSkillMap[ps.profile_id]) profileSkillMap[ps.profile_id] = [];
    if (!profileSkillObjMap[ps.profile_id]) profileSkillObjMap[ps.profile_id] = [];
    profileSkillMap[ps.profile_id].push(ps.skill_id);
    profileSkillObjMap[ps.profile_id].push(ps.skills);
  }

  // 5. Calculate match scores
  const scored = profiles.map((profile) => {
    const profileSkillIds = profileSkillMap[profile.id] || [];
    profile.skills = profileSkillObjMap[profile.id] || [];

    const overlap = requiredSkillIds.filter((s) => profileSkillIds.includes(s));
    const score = Math.round((overlap.length / requiredSkillIds.length) * 100);

    const matchingSkills = requiredSkillObjects.filter((s) => profileSkillIds.includes(s.id));

    return { ...profile, match_score: score, matching_skills: matchingSkills };
  });

  // 6. Sort by score descending, filter out 0%
  return scored
    .filter((p) => p.match_score > 0)
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 20);
}
