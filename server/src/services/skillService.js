import supabase from '../config/supabase.js';

/**
 * Get all skills.
 */
export async function getAllSkills() {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch skills: ${error.message}`);
  }

  return data;
}
