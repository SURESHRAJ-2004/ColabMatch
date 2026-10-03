import supabase from '../config/supabase.js';
import { getRecommendedProjects } from './matchService.js';

/**
 * Get aggregated dashboard data for a user.
 */
export async function getDashboardData(userId) {
  // 1. Profile summary
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, college, course, experience_level')
    .eq('id', userId)
    .single();

  // 2. My projects (owned)
  const { data: myProjects } = await supabase
    .from('projects')
    .select('id, title, status, category, created_at')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  // 3. Projects I'm a member of (not owner)
  const { data: memberProjects } = await supabase
    .from('project_members')
    .select('project_id, role, projects(id, title, status, category)')
    .eq('profile_id', userId)
    .neq('role', 'owner')
    .limit(5);

  // 4. Incoming join requests (for my projects)
  const { data: incomingRequests } = await supabase
    .from('join_requests')
    .select('id, status, created_at, message, profiles(id, full_name, avatar_url), projects!inner(id, title, owner_id)')
    .eq('projects.owner_id', userId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(10);

  // 5. My outgoing requests
  const { data: outgoingRequests } = await supabase
    .from('join_requests')
    .select('id, status, created_at, projects(id, title)')
    .eq('profile_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  // 6. Recommended projects (top 5)
  let recommendedProjects = [];
  try {
    const allRecommended = await getRecommendedProjects(userId);
    recommendedProjects = allRecommended.slice(0, 5);
  } catch {
    // Non-critical, return empty
  }

  // 7. Stats
  const { count: totalProjects } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('owner_id', userId);

  const { count: totalMemberships } = await supabase
    .from('project_members')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', userId);

  const { count: pendingRequests } = await supabase
    .from('join_requests')
    .select('*, projects!inner(owner_id)', { count: 'exact', head: true })
    .eq('projects.owner_id', userId)
    .eq('status', 'pending');

  return {
    profile,
    myProjects: myProjects || [],
    memberProjects: (memberProjects || []).map((mp) => ({ ...mp.projects, role: mp.role })),
    incomingRequests: incomingRequests || [],
    outgoingRequests: outgoingRequests || [],
    recommendedProjects,
    stats: {
      totalProjects: totalProjects || 0,
      totalMemberships: totalMemberships || 0,
      pendingRequests: pendingRequests || 0,
    },
  };
}
