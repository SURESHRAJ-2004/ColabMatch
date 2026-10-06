import { useState } from 'react';
import Input, { Textarea, Select } from '../ui/Input';
import Button from '../ui/Button';
import SkillSelector from './SkillSelector';
import { User, GraduationCap, Sparkles } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../ui/SocialIcons';
import { getInitials } from '../../utils/helpers';

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

  const displayName = form.full_name || profile?.full_name || 'Student Developer';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full">
      {/* 1. Header Profile Banner Preview */}
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-xs shrink-0 text-base font-bold">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={displayName}
              className="w-14 h-14 object-cover"
            />
          ) : (
            <span>{getInitials(displayName)}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-slate-900 truncate">
              {displayName}
            </h4>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 capitalize">
              {form.experience_level}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-normal truncate mt-0.5 flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
            <span>{form.college || profile?.college || 'Student Developer Profile'}</span>
          </p>
        </div>
      </div>

      {/* 2. Personal & Academic Information */}
      <div className="space-y-4">
        <div className="pb-1 border-b border-slate-100 flex items-center gap-2">
          <User className="w-4 h-4 text-slate-500" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Personal & Academic Background
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
          label="Developer Bio & Interests"
          id="bio"
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Tell prospective team leads about yourself, your project aspirations, and your builder experience..."
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
            label="Degree / Major"
            id="course"
            name="course"
            value={form.course}
            onChange={handleChange}
            placeholder="e.g. B.Tech Computer Science"
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
            { value: 'advanced', label: 'Advanced (Experienced Builder / Open Source Contributor)' },
          ]}
        />
      </div>

      {/* 3. Technical Skills */}
      <div className="space-y-3">
        <div className="pb-1 border-b border-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Technical Stack & Verified Skills
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Select technologies you are proficient with. This directly influences project match compatibility scores.
        </p>
        <SkillSelector selectedSkills={skills} onChange={setSkills} />
      </div>

      {/* 4. Portfolio & Profiles */}
      <div className="space-y-4">
        <div className="pb-1 border-b border-slate-100 flex items-center gap-2">
          <GithubIcon className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Online Profiles & Portfolio
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
            icon={GithubIcon}
          />
          <Input
            label="LinkedIn Profile URL"
            id="linkedin_url"
            name="linkedin_url"
            type="url"
            value={form.linkedin_url}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/username"
            icon={LinkedinIcon}
          />
        </div>
      </div>

      {/* 5. Save Button Footer */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-slate-400 font-normal order-2 sm:order-1 text-center sm:text-left">
          Skills and experience data are utilized directly by the matching engine.
        </p>
        <Button
          type="submit"
          loading={loading}
          size="lg"
          className="w-full sm:w-auto px-8 font-semibold order-1 sm:order-2 shadow-xs"
        >
          Save Profile
        </Button>
      </div>
    </form>
  );
}
