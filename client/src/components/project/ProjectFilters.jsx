import { useState } from 'react';
import { Select } from '../ui/Input';
import { Search, RotateCcw } from 'lucide-react';

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
  { value: 'open', label: 'Recruiting' },
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
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs w-full">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="md:col-span-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, stack, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 bg-white text-slate-900 placeholder:text-slate-400 shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="h-10 px-4 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-all shrink-0 shadow-xs cursor-pointer select-none active:scale-[0.98]"
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
              title="Reset all filters"
              className="h-10 w-10 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shrink-0 flex items-center justify-center shadow-xs"
              aria-label="Clear filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
