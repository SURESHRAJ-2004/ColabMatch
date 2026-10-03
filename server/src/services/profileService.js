import supabase from '../config/supabase.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Get profile by user ID, including skills.
 */
export async function getProfileById(userId) {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !profile) {
    throw new NotFoundError('Profile not found');
  }

  // Fetch skills
  const { data: profileSkills } = await supabase
    .from('profile_skills')
    .select('skill_id, skills(id, name)')
    .eq('profile_id', userId);

  profile.skills = profileSkills ? profileSkills.map((ps) => ps.skills) : [];

  return profile;
}

/**
 * Update profile fields for a user.
 */
export async function updateProfile(userId, updates) {
  const allowedFields = [
    'full_name', 'avatar_url', 'bio', 'college',
    'course', 'experience_level', 'github_url', 'linkedin_url',
  ];

  const filtered = {};
  for (const key of allowedFields) {
    if (updates[key] !== undefined) {
      filtered[key] = updates[key];
    }
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(filtered)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  return data;
}

/**
 * Replace all skills for a profile.
 */
export async function setProfileSkills(userId, skillIds) {
  // Delete existing
  await supabase
    .from('profile_skills')
    .delete()
    .eq('profile_id', userId);

  if (skillIds.length === 0) return [];

  // Insert new
  const rows = skillIds.map((skillId) => ({
    profile_id: userId,
    skill_id: skillId,
  }));

  const { data, error } = await supabase
    .from('profile_skills')
    .insert(rows)
    .select('skill_id, skills(id, name)');

  if (error) {
    throw new Error(`Failed to set skills: ${error.message}`);
  }

  return data.map((ps) => ps.skills);
}

/**
 * Browse profiles with optional skill filtering and pagination.
 */
export async function browseProfiles({ search, skillIds, page = 1, limit = 20 }) {
  let query = supabase.from('profiles').select('*', { count: 'exact' });

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,college.ilike.%${search}%`);
  }

  const offset = (page - 1) * limit;
  query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

  const { data: profiles, error, count } = await query;

  if (error) {
    throw new Error(`Failed to browse profiles: ${error.message}`);
  }

  // If filtering by skills, fetch profile_skills and filter in memory
  if (skillIds && skillIds.length > 0) {
    const profileIds = profiles.map((p) => p.id);
    const { data: allProfileSkills } = await supabase
      .from('profile_skills')
      .select('profile_id, skill_id')
      .in('profile_id', profileIds);

    const skillMap = {};
    for (const ps of allProfileSkills || []) {
      if (!skillMap[ps.profile_id]) skillMap[ps.profile_id] = [];
      skillMap[ps.profile_id].push(ps.skill_id);
    }

    const filtered = profiles.filter((p) => {
      const pSkills = skillMap[p.id] || [];
      return skillIds.some((s) => pSkills.includes(s));
    });

    return { profiles: filtered, total: filtered.length };
  }

  // Attach skills to each profile
  if (profiles.length > 0) {
    const profileIds = profiles.map((p) => p.id);
    const { data: allProfileSkills } = await supabase
      .from('profile_skills')
      .select('profile_id, skills(id, name)')
      .in('profile_id', profileIds);

    const skillMap = {};
    for (const ps of allProfileSkills || []) {
      if (!skillMap[ps.profile_id]) skillMap[ps.profile_id] = [];
      skillMap[ps.profile_id].push(ps.skills);
    }

    for (const profile of profiles) {
      profile.skills = skillMap[profile.id] || [];
    }
  }

  return { profiles, total: count };
}
