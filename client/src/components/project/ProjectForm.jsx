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
    setForm({ ...form, [name]: name === 'team_size' ? parseInt(value, 10) : value });
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
      {/* 1. General Project Details */}
      <div className="space-y-4">
        <Input
          label="Project Title"
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="e.g. AI-Powered Autonomous Health Monitor"
        />

        <Textarea
          label="Project Overview & Objectives"
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe what your team is building, technical stack choices, key milestones, and collaborator responsibilities..."
          rows={4}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Domain Category"
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            options={categories}
          />
          <Input
            label="Target Team Capacity (Seats)"
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
              { value: 'open', label: 'Recruiting (Open to join requests)' },
              { value: 'in_progress', label: 'In Progress (Active Development)' },
              { value: 'completed', label: 'Completed (Archived Showcase)' },
            ]}
          />
        )}
      </div>

      {/* 2. Required Technical Skills */}
      <div className="pt-2 border-t border-slate-100">
        <div className="mb-3">
          <label className="text-xs font-semibold text-slate-700 tracking-tight block">
            Required Technical Stack & Skills
          </label>
          <p className="text-xs text-slate-400 mt-0.5">
            Select the skills your project needs. Our algorithm matches student candidates who know these tools.
          </p>
        </div>
        <SkillSelector selectedSkills={skills} onChange={setSkills} />
      </div>

      {/* 3. Form Submit Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
        <Button
          type="submit"
          loading={loading}
          size="lg"
          className="w-full sm:w-auto px-7 font-semibold shadow-xs"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
