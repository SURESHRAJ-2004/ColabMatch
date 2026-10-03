import 'dotenv/config';
import supabase from '../config/supabase.js';

const tables = [
  'skills',
  'profiles',
  'projects',
  'project_members',
  'project_skills',
  'join_requests',
  'profile_skills',
];

async function runCheck() {
  console.log('='.repeat(60));
  console.log('COLABMATCH Supabase Database Connection & Query Check');
  console.log('='.repeat(60));
  console.log('Supabase URL:', process.env.SUPABASE_URL || 'NOT SET');
  console.log('Key configured:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'YES (length: ' + process.env.SUPABASE_SERVICE_ROLE_KEY.length + ')' : 'NO');
  console.log('-'.repeat(60));

  let hasErrors = false;

  for (const table of tables) {
    const { data, error, count } = await supabase
      .from(table)
      .select('*')
      .limit(1);

    if (error) {
      hasErrors = true;
      console.log(`❌ [${table}] Error (${error.code || 'unknown'}): ${error.message}`);
      if (error.hint) console.log(`   💡 Hint: ${error.hint}`);
    } else {
      console.log(`✅ [${table}] Accessible`);
    }
  }

  console.log('-'.repeat(60));

  // Try querying sample skills
  const { data: skills, error: skillsErr } = await supabase
    .from('skills')
    .select('id, name')
    .limit(10);

  if (skillsErr) {
    console.log(`❌ Fetch sample skills failed: ${skillsErr.message}`);
  } else if (skills) {
    console.log(`✅ Sample skills in DB (${skills.length}):`, skills.map((s) => s.name).join(', '));
  }

  console.log('='.repeat(60));
  if (hasErrors) {
    console.log('⚠️  Status: Permission denied on tables.');
    console.log('To fix this, execute the GRANT statements in Supabase SQL Editor:');
    console.log(`
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;
`);
  } else {
    console.log('🎉 Status: All tables are accessible and queries are working!');
  }
}

runCheck().catch((err) => {
  console.error('Fatal check error:', err);
  process.exit(1);
});
