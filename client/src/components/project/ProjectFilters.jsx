import { useState } from 'react';
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

  const handleClear = () => {
    setSearch('');
    onChange({ ...filters, search: '', category: '', status: '' });
  };

  const hasActiveFilters = Boolean(filters.search || filters.category || filters.status);

  return (
    <div className="bg-white rounded-[26px] border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="md:col-span-6 flex gap-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder="Search projects by title, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10.5 pl-10 pr-3.5 rounded-xl border border-slate-200/90 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f261f]/15 focus:border-[#0f261f] bg-white text-slate-900 placeholder:text-slate-400 shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="h-10.5 px-4 rounded-xl bg-[#0f261f] text-white text-xs sm:text-sm font-bold hover:bg-[#18362c] transition-all shrink-0 shadow-xs cursor-pointer select-none active:scale-[0.98]"
          >
            Search
          </button>
        </form>

        {/* Category filter */}
        <div className="md:col-span-3">
          <Select
            id="filter-category"
            value={filters.category || ''}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            options={categories}
            className="w-full"
          />
        </div>

        {/* Status filter & Clear action */}
        <div className="md:col-span-3 flex items-center gap-2">
          <div className="flex-1">
            <Select
              id="filter-status"
              value={filters.status || ''}
              onChange={(e) => onChange({ ...filters, status: e.target.value })}
              options={statuses}
              className="w-full"
            />
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClear}
              title="Reset filters"
              className="h-10.5 w-10.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shrink-0 flex items-center justify-center shadow-2xs"
              aria-label="Clear filters"
            >
              <span className="material-symbols-outlined text-lg">restart_alt</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
