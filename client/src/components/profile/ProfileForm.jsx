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
    onSubmit({
      ...form,
      github_url: form.github_url || null,
      linkedin_url: form.linkedin_url || null,
    }, skills);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="Full Name"
        id="full_name"
        name="full_name"
        value={form.full_name}
        onChange={handleChange}
        required
        placeholder="Your full name"
      />

      <Textarea
        label="Bio"
        id="bio"
        name="bio"
        value={form.bio}
        onChange={handleChange}
        placeholder="Tell others about yourself..."
        rows={3}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="College"
          id="college"
          name="college"
          value={form.college}
          onChange={handleChange}
          placeholder="Your college/university"
        />
        <Input
          label="Course"
          id="course"
          name="course"
          value={form.course}
          onChange={handleChange}
          placeholder="e.g., B.Tech CSE"
        />
      </div>

      <Select
        label="Experience Level"
        id="experience_level"
        name="experience_level"
        value={form.experience_level}
        onChange={handleChange}
        options={[
          { value: 'beginner', label: 'Beginner' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'advanced', label: 'Advanced' },
        ]}
      />

      <div>
        <label className="text-sm font-medium text-text-primary mb-2 block">Skills</label>
        <SkillSelector selectedSkills={skills} onChange={setSkills} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="GitHub URL"
          id="github_url"
          name="github_url"
          type="url"
          value={form.github_url}
          onChange={handleChange}
          placeholder="https://github.com/username"
        />
        <Input
          label="LinkedIn URL"
          id="linkedin_url"
          name="linkedin_url"
          type="url"
          value={form.linkedin_url}
          onChange={handleChange}
          placeholder="https://linkedin.com/in/username"
        />
      </div>

      <Button type="submit" loading={loading} className="self-end">
        Save Profile
      </Button>
    </form>
  );
}
