import { useState } from 'react';
import SkillBadge from '../ui/SkillBadge';
import { Select } from '../ui/Input';

const categories = [
  { value: '', label: 'All Categories' },
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

const statuses = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export default function ProjectFilters({ filters, onChange }) {
  const [search, setSearch] = useState(filters.search || '');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onChange({ ...filters, search });
  };

  return (
    <div className="bg-white rounded-xl border border-border p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Category filter */}
        <Select
          id="filter-category"
          value={filters.category || ''}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          options={categories}
          className="sm:w-44"
        />

        {/* Status filter */}
        <Select
          id="filter-status"
          value={filters.status || ''}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          options={statuses}
          className="sm:w-36"
        />
      </div>
    </div>
  );
}
