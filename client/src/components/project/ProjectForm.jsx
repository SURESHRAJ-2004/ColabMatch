import { useState } from 'react';
import Input, { Textarea, Select } from '../ui/Input';
import Button from '../ui/Button';
import SkillSelector from '../profile/SkillSelector';

const categories = [
  { value: '', label: 'Select a category' },
  { value: 'Web Development', label: 'Web Development' },
  { value: 'Mobile App', label: 'Mobile App' },
  { value: 'Machine Learning', label: 'Machine Learning' },
  { value: 'Data Science', label: 'Data Science' },
  { value: 'IoT', label: 'IoT' },
  { value: 'Blockchain', label: 'Blockchain' },
  { value: 'Game Development', label: 'Game Development' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'Other', label: 'Other' },
];

export default function ProjectForm({ project, onSubmit, loading, submitLabel = 'Create Project' }) {
  const [form, setForm] = useState({
    title: project?.title || '',
    description: project?.description || '',
    category: project?.category || '',
    team_size: project?.team_size || 4,
    status: project?.status || 'open',
  });
  const [skills, setSkills] = useState(project?.skills || []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'team_size' ? parseInt(value) : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      skill_ids: skills.map((s) => s.id),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Input
        label="Project Title"
        id="title"
        name="title"
        value={form.title}
        onChange={handleChange}
        required
        placeholder="e.g. AI-Powered Autonomous Rover"
      />

      <Textarea
        label="Project Overview & Goals"
        id="description"
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Describe the initiative, architecture, key deliverables, and ideal collaborator contributions..."
        rows={4}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Category"
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
          options={categories}
        />
        <Input
          label="Team Capacity (Target Members)"
          id="team_size"
          name="team_size"
          type="number"
          min={2}
          max={20}
          value={form.team_size}
          onChange={handleChange}
        />
      </div>

      {project && (
        <Select
          label="Project Status"
          id="status"
          name="status"
          value={form.status}
          onChange={handleChange}
          options={[
            { value: 'open', label: 'Open (Recruiting)' },
            { value: 'in_progress', label: 'In Progress (Active Development)' },
            { value: 'completed', label: 'Completed (Archived)' },
          ]}
        />
      )}

      <div>
        <label className="text-xs font-semibold text-slate-700 tracking-tight mb-2 block">
          Required Technical Skills
        </label>
        <SkillSelector selectedSkills={skills} onChange={setSkills} />
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <Button
          type="submit"
          loading={loading}
          size="lg"
          className="w-full sm:w-auto px-7 font-bold shadow-xs"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
