import supabase from '../config/supabase.js';
import { NotFoundError, ForbiddenError, ConflictError } from '../utils/errors.js';

/**
 * Create a join request.
 */
export async function createJoinRequest(projectId, profileId, message) {
  // Check project exists and is open
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, owner_id, status, team_size')
    .eq('id', projectId)
    .single();

  if (projectError || !project) {
    throw new NotFoundError('Project not found');
  }

  if (project.status !== 'open') {
    throw new ForbiddenError('Project is not accepting new members');
  }

  // Check if user is the owner
  if (project.owner_id === profileId) {
    throw new ForbiddenError('You cannot request to join your own project');
  }

  // Check if already a member
  const { data: existingMember } = await supabase
    .from('project_members')
    .select('profile_id')
    .eq('project_id', projectId)
    .eq('profile_id', profileId)
    .single();

  if (existingMember) {
    throw new ConflictError('You are already a member of this project');
  }

  // Check team size
  const { count: memberCount } = await supabase
    .from('project_members')
    .select('*', { count: 'exact', head: true })
    .eq('project_id', projectId);

  if (memberCount >= project.team_size) {
    throw new ForbiddenError('Project team is full');
  }

  // Create request (UNIQUE constraint will catch duplicates)
  const { data, error } = await supabase
    .from('join_requests')
    .insert({
      project_id: projectId,
      profile_id: profileId,
      message: message || null,
    })
    .select('*, profiles(id, full_name, avatar_url), projects(id, title)')
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new ConflictError('You already have a pending request for this project');
    }
    throw new Error(`Failed to create join request: ${error.message}`);
  }

  return data;
}

/**
 * Get join requests for a project (owner only).
 */
export async function getProjectJoinRequests(projectId, ownerId) {
  // Verify ownership
  const { data: project } = await supabase
    .from('projects')
    .select('owner_id')
    .eq('id', projectId)
    .single();

  if (!project || project.owner_id !== ownerId) {
    throw new ForbiddenError('Only the project owner can view join requests');
  }

  const { data, error } = await supabase
    .from('join_requests')
    .select('*, profiles(id, full_name, avatar_url, college, experience_level)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to get join requests: ${error.message}`);
  }

  // Attach skills to each requester profile
  if (data && data.length > 0) {
    const profileIds = data.map((r) => r.profile_id);
    const { data: profileSkills } = await supabase
      .from('profile_skills')
      .select('profile_id, skills(id, name)')
      .in('profile_id', profileIds);

    const skillMap = {};
    for (const ps of profileSkills || []) {
      if (!skillMap[ps.profile_id]) skillMap[ps.profile_id] = [];
      skillMap[ps.profile_id].push(ps.skills);
    }

    for (const request of data) {
      request.requester_skills = skillMap[request.profile_id] || [];
    }
  }

  return data;
}

/**
 * Accept or reject a join request (project owner only).
 */
export async function respondToJoinRequest(requestId, ownerId, action) {
  // Get the request
  const { data: request, error: fetchError } = await supabase
    .from('join_requests')
    .select('*, projects(owner_id, team_size)')
    .eq('id', requestId)
    .single();

  if (fetchError || !request) {
    throw new NotFoundError('Join request not found');
  }

  if (request.projects.owner_id !== ownerId) {
    throw new ForbiddenError('Only the project owner can respond to join requests');
  }

  if (request.status !== 'pending') {
    throw new ConflictError(`Request has already been ${request.status}`);
  }

  const newStatus = action === 'accept' ? 'accepted' : 'rejected';

  // Update request status
  const { error: updateError } = await supabase
    .from('join_requests')
    .update({ status: newStatus })
    .eq('id', requestId);

  if (updateError) {
    throw new Error(`Failed to update request: ${updateError.message}`);
  }

  // If accepted, add as member
  if (newStatus === 'accepted') {
    // Check team size again
    const { count: memberCount } = await supabase
      .from('project_members')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', request.project_id);

    if (memberCount >= request.projects.team_size) {
      // Revert the status update
      await supabase
        .from('join_requests')
        .update({ status: 'pending' })
        .eq('id', requestId);
      throw new ForbiddenError('Project team is full');
    }

    await supabase.from('project_members').insert({
      project_id: request.project_id,
      profile_id: request.profile_id,
      role: 'member',
    });
  }

  return { message: `Request ${newStatus}` };
}

/**
 * Get outgoing join requests for the current user.
 */
export async function getUserJoinRequests(profileId) {
  const { data, error } = await supabase
    .from('join_requests')
    .select('*, projects(id, title, status, profiles!owner_id(full_name))')
    .eq('profile_id', profileId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to get user requests: ${error.message}`);
  }

  return data;
}
