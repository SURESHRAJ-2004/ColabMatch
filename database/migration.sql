-- ============================================================
-- COLABMATCH Database Migration
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  college TEXT,
  course TEXT,
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  github_url TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. skills (shared lookup table)
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

-- 3. profile_skills (many-to-many)
CREATE TABLE profile_skills (
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (profile_id, skill_id)
);

-- 4. projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  team_size INT DEFAULT 4,
  status TEXT CHECK (status IN ('open', 'in_progress', 'completed')) DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. project_skills (many-to-many)
CREATE TABLE project_skills (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, skill_id)
);

-- 6. project_members
CREATE TABLE project_members (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'member')) DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (project_id, profile_id)
);

-- 7. join_requests
CREATE TABLE join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, profile_id)
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_projects_owner ON projects(owner_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_project_members_profile ON project_members(profile_id);
CREATE INDEX idx_join_requests_project ON join_requests(project_id);
CREATE INDEX idx_join_requests_profile ON join_requests(profile_id);
CREATE INDEX idx_join_requests_status ON join_requests(status);
CREATE INDEX idx_profile_skills_skill ON profile_skills(skill_id);
CREATE INDEX idx_project_skills_skill ON project_skills(skill_id);

-- ============================================================
-- Auto-create profile on sign-up (trigger)
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- Updated_at trigger function
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- skills
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view skills"
  ON skills FOR SELECT
  TO authenticated
  USING (true);

-- profile_skills
ALTER TABLE profile_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view profile skills"
  ON profile_skills FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own profile skills"
  ON profile_skills FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can delete own profile skills"
  ON profile_skills FOR DELETE
  TO authenticated
  USING (auth.uid() = profile_id);

-- projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- project_skills
ALTER TABLE project_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view project skills"
  ON project_skills FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Project owners can insert project skills"
  ON project_skills FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_id AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can delete project skills"
  ON project_skills FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_id AND projects.owner_id = auth.uid()
    )
  );

-- project_members
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view project members"
  ON project_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Project owners can manage members"
  ON project_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_id AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Project owners can remove members"
  ON project_members FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_id AND projects.owner_id = auth.uid()
    )
  );

-- join_requests
ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own requests or project owner can view"
  ON join_requests FOR SELECT
  TO authenticated
  USING (
    auth.uid() = profile_id
    OR EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_id AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create join requests"
  ON join_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Project owners can update join requests"
  ON join_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_id AND projects.owner_id = auth.uid()
    )
  );

-- ============================================================
-- Seed skills
-- ============================================================
INSERT INTO skills (name) VALUES
  ('JavaScript'), ('TypeScript'), ('Python'), ('Java'), ('C++'),
  ('React'), ('Angular'), ('Vue.js'), ('Node.js'), ('Express.js'),
  ('Django'), ('Flask'), ('Spring Boot'), ('PostgreSQL'), ('MongoDB'),
  ('Docker'), ('AWS'), ('Git'), ('Machine Learning'), ('Data Science'),
  ('Flutter'), ('React Native'), ('Swift'), ('Kotlin'), ('Rust'),
  ('Go'), ('GraphQL'), ('Redis'), ('Figma'), ('UI/UX Design');
