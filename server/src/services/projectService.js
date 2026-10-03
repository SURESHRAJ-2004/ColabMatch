import supabase from '../config/supabase.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

/**
 * Create a new project.
 */
export async function createProject(ownerId, projectData) {
  const { title, description, category, team_size, skill_ids = [] } = projectData;

  // Insert project
  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      owner_id: ownerId,
      title,
      description,
      category,
      team_size: team_size || 4,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create project: ${error.message}`);
  }

  // Insert project skills
  if (skill_ids.length > 0) {
    const skillRows = skill_ids.map((skillId) => ({
      project_id: project.id,
      skill_id: skillId,
    }));
    await supabase.from('project_skills').insert(skillRows);
  }

  // Add owner as project member
  await supabase.from('project_members').insert({
    project_id: project.id,
    profile_id: ownerId,
    role: 'owner',
  });

  return getProjectById(project.id);
}

/**
 * Get a project by ID with skills, members, and owner profile.
 */
export async function getProjectById(projectId) {
  const { data: project, error } = await supabase
    .from('projects')
    .select('*, profiles!owner_id(id, full_name, avatar_url)')
    .eq('id', projectId)
    .single();

  if (error || !project) {
    throw new NotFoundError('Project not found');
  }

  // Fetch skills
  const { data: projectSkills } = await supabase
    .from('project_skills')
    .select('skill_id, skills(id, name)')
    .eq('project_id', projectId);

  project.skills = projectSkills ? projectSkills.map((ps) => ps.skills) : [];

  // Fetch members
  const { data: members } = await supabase
    .from('project_members')
    .select('profile_id, role, joined_at, profiles(id, full_name, avatar_url)')
    .eq('project_id', projectId);

  project.members = members || [];

  // Rename the nested profile for cleaner output
  project.owner = project.profiles;
  delete project.profiles;

  return project;
}

/**
 * List projects with search, filter, and pagination.
 */
export async function listProjects({ search, category, status, skillIds, page = 1, limit = 12 }) {
  let query = supabase
    .from('projects')
    .select('*, profiles!owner_id(id, full_name, avatar_url)', { count: 'exact' });

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }
  if (category) {
    query = query.eq('category', category);
  }
  if (status) {
    query = query.eq('status', status);
  }

  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

  const { data: projects, error, count } = await query;

  if (error) {
    throw new Error(`Failed to list projects: ${error.message}`);
  }

  // Attach skills to each project
  if (projects.length > 0) {
    const projectIds = projects.map((p) => p.id);
    const { data: allProjectSkills } = await supabase
      .from('project_skills')
      .select('project_id, skills(id, name)')
      .in('project_id', projectIds);

    const skillMap = {};
    for (const ps of allProjectSkills || []) {
      if (!skillMap[ps.project_id]) skillMap[ps.project_id] = [];
      skillMap[ps.project_id].push(ps.skills);
    }

    for (const project of projects) {
      project.skills = skillMap[project.id] || [];
      project.owner = project.profiles;
      delete project.profiles;
    }

    // Filter by skills if provided
    if (skillIds && skillIds.length > 0) {
      const filtered = projects.filter((p) => {
        const pSkillIds = p.skills.map((s) => s.id);
        return skillIds.some((s) => pSkillIds.includes(s));
      });
      return { projects: filtered, total: filtered.length };
    }
  }

  return { projects, total: count };
}

/**
 * Update a project (owner only).
 */
export async function updateProject(projectId, ownerId, updates) {
  // Verify ownership
  const existing = await getProjectById(projectId);
  if (existing.owner_id !== ownerId) {
    throw new ForbiddenError('Only the project owner can update this project');
  }

  const { title, description, category, team_size, status, skill_ids } = updates;

  const updateFields = {};
  if (title !== undefined) updateFields.title = title;
  if (description !== undefined) updateFields.description = description;
  if (category !== undefined) updateFields.category = category;
  if (team_size !== undefined) updateFields.team_size = team_size;
  if (status !== undefined) updateFields.status = status;

  if (Object.keys(updateFields).length > 0) {
    const { error } = await supabase
      .from('projects')
      .update(updateFields)
      .eq('id', projectId);

    if (error) {
      throw new Error(`Failed to update project: ${error.message}`);
    }
  }

  // Update skills if provided
  if (skill_ids !== undefined) {
    await supabase.from('project_skills').delete().eq('project_id', projectId);

    if (skill_ids.length > 0) {
      const skillRows = skill_ids.map((skillId) => ({
        project_id: projectId,
        skill_id: skillId,
      }));
      await supabase.from('project_skills').insert(skillRows);
    }
  }

  return getProjectById(projectId);
}

/**
 * Delete a project (owner only).
 */
export async function deleteProject(projectId, ownerId) {
  const existing = await getProjectById(projectId);
  if (existing.owner_id !== ownerId) {
    throw new ForbiddenError('Only the project owner can delete this project');
  }

  const { error } = await supabase.from('projects').delete().eq('id', projectId);

  if (error) {
    throw new Error(`Failed to delete project: ${error.message}`);
  }

  return { message: 'Project deleted successfully' };
}

/**
 * Get project members.
 */
export async function getProjectMembers(projectId) {
  const { data, error } = await supabase
    .from('project_members')
    .select('profile_id, role, joined_at, profiles(id, full_name, avatar_url, college)')
    .eq('project_id', projectId)
    .order('joined_at');

  if (error) {
    throw new Error(`Failed to get members: ${error.message}`);
  }

  return data;
}

/**
 * Remove a member from a project (owner only).
 */
export async function removeMember(projectId, profileId, ownerId) {
  const project = await getProjectById(projectId);
  if (project.owner_id !== ownerId) {
    throw new ForbiddenError('Only the project owner can remove members');
  }

  if (profileId === ownerId) {
    throw new ForbiddenError('Cannot remove yourself as owner');
  }

  const { error } = await supabase
    .from('project_members')
    .delete()
    .eq('project_id', projectId)
    .eq('profile_id', profileId);

  if (error) {
    throw new Error(`Failed to remove member: ${error.message}`);
  }

  return { message: 'Member removed successfully' };
}
