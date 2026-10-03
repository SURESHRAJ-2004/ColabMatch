import supabase from '../config/supabase.js';
import { NotFoundError } from '../utils/errors.js';

/**
 * Get profile by user ID, including skills.
 */
export async function getProfileById(userId) {
  let { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  // If profile does not exist yet, lazily create it from auth.users metadata
  if (!profile) {
    try {
      const { data: authUserData } = await supabase.auth.admin.getUserById(userId);
      if (authUserData?.user) {
        const u = authUserData.user;
        const initialProfile = {
          id: userId,
          full_name: u.user_metadata?.full_name || u.email?.split('@')[0] || 'User',
          avatar_url: u.user_metadata?.avatar_url || '',
        };
        const { data: created, error: createError } = await supabase
          .from('profiles')
          .upsert(initialProfile, { onConflict: 'id' })
          .select()
          .single();

        if (!createError && created) {
          profile = created;
        }
      }
    } catch (err) {
      console.warn('Failed to lazily create profile:', err.message);
    }
  }

  if (!profile) {
    throw new NotFoundError('Profile not found');
  }

  // Fetch skills
  const { data: profileSkills } = await supabase
    .from('profile_skills')
    .select('skill_id, skills(id, name)')
    .eq('profile_id', userId);

  profile.skills = profileSkills
    ? profileSkills.map((ps) => ps.skills).filter(Boolean)
    : [];

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
      // Convert empty strings for optional fields to null
      if (typeof updates[key] === 'string' && updates[key].trim() === '' && key !== 'full_name') {
        filtered[key] = null;
      } else {
        filtered[key] = updates[key];
      }
    }
  }

  // Ensure full_name is present if creating new profile row via upsert
  if (!filtered.full_name) {
    const { data: existing } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .maybeSingle();

    if (!existing) {
      const { data: authUser } = await supabase.auth.admin.getUserById(userId);
      filtered.full_name =
        authUser?.user?.user_metadata?.full_name ||
        authUser?.user?.email?.split('@')[0] ||
        'User';
    }
  }

  // Use upsert to handle both insert and update safely
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...filtered, updated_at: new Date().toISOString() }, { onConflict: 'id' })
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

  // Deduplicate skill IDs
  const uniqueSkillIds = [...new Set((skillIds || []).map(Number).filter((id) => !isNaN(id) && id > 0))];

  if (uniqueSkillIds.length === 0) return [];

  // Insert new
  const rows = uniqueSkillIds.map((skillId) => ({
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

  return (data || []).map((ps) => ps.skills).filter(Boolean);
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
