import { useState } from 'react';
import Input, { Textarea, Select } from '../ui/Input';
import Button from '../ui/Button';
import SkillSelector from './SkillSelector';

export default function ProfileForm({ profile, onSubmit, loading }) {
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    college: profile?.college || '',
    course: profile?.course || '',
    experience_level: profile?.experience_level || 'beginner',
    github_url: profile?.github_url || '',
    linkedin_url: profile?.linkedin_url || '',
  });
  const [skills, setSkills] = useState(profile?.skills || []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(
      {
        ...form,
        github_url: form.github_url || null,
        linkedin_url: form.linkedin_url || null,
      },
      skills
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* 1. Header Profile Banner Preview */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-2xs shrink-0">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={form.full_name || 'Profile'}
              className="w-14 h-14 object-cover"
            />
          ) : (
            <span className="material-symbols-outlined text-slate-400 text-3xl">person</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-base font-bold text-slate-900 truncate">
            {form.full_name || 'Your Full Name'}
          </h4>
          <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
            {form.college || profile?.college || 'Student Developer Profile'}
          </p>
        </div>
      </div>

      {/* 2. Personal Information Group */}
      <div className="space-y-4">
        <div className="pb-1 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Personal & Academic Information
          </h3>
        </div>

        <Input
          label="Full Name"
          id="full_name"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          required
          placeholder="e.g. Alex Morgan"
        />

        <Textarea
          label="Professional Bio"
          id="bio"
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Introduce yourself, your academic background, areas of interest, and ideal project role..."
          rows={3}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="College / University"
            id="college"
            name="college"
            value={form.college}
            onChange={handleChange}
            placeholder="e.g. Stanford University"
          />
          <Input
            label="Degree / Major Course"
            id="course"
            name="course"
            value={form.course}
            onChange={handleChange}
            placeholder="e.g. B.S. Computer Science"
          />
        </div>

        <Select
          label="Experience Level"
          id="experience_level"
          name="experience_level"
          value={form.experience_level}
          onChange={handleChange}
          options={[
            { value: 'beginner', label: 'Beginner (1st/2nd Year)' },
            { value: 'intermediate', label: 'Intermediate (3rd/Final Year)' },
            { value: 'advanced', label: 'Advanced (Experienced Builder)' },
          ]}
        />
      </div>

      {/* 3. Technical Skills Group */}
      <div className="space-y-3">
        <div className="pb-1 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Technical Stack & Skills
          </h3>
        </div>
        <SkillSelector selectedSkills={skills} onChange={setSkills} />
      </div>

      {/* 4. Portfolio & Profiles Group */}
      <div className="space-y-4">
        <div className="pb-1 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Online Presence & Links
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="GitHub Profile URL"
            id="github_url"
            name="github_url"
            type="url"
            value={form.github_url}
            onChange={handleChange}
            placeholder="https://github.com/username"
            icon="code"
          />
          <Input
            label="LinkedIn Profile URL"
            id="linkedin_url"
            name="linkedin_url"
            type="url"
            value={form.linkedin_url}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
            icon="link"
          />
        </div>
      </div>

      {/* 5. Save Button Footer */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-400 font-medium order-2 sm:order-1 text-center sm:text-left">
          Skills and details are used directly by the matching algorithm.
        </p>
        <Button
          type="submit"
          loading={loading}
          size="lg"
          className="w-full sm:w-auto px-8 font-bold order-1 sm:order-2 shadow-xs"
        >
          Save Profile
        </Button>
      </div>
    </form>
  );
}
