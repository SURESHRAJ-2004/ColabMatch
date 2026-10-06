import { useState, useEffect } from 'react';
import api from '../../services/api';
import SkillBadge from '../ui/SkillBadge';
import Spinner from '../ui/Spinner';
import { Search, X, CheckCircle2 } from 'lucide-react';

export default function SkillSelector({ selectedSkills = [], onChange }) {
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/skills')
      .then((res) => setAllSkills(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleSkill = (skill) => {
    const isSelected = selectedSkills.some((s) => s.id === skill.id);
    if (isSelected) {
      onChange(selectedSkills.filter((s) => s.id !== skill.id));
    } else {
      onChange([...selectedSkills, skill]);
    }
  };

  const filtered = allSkills.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Spinner size="sm" className="py-4" />;

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Search Input */}
      <div className="relative w-full">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Filter skills (e.g. React, Python, Docker, PyTorch)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-9 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 bg-white text-slate-900 placeholder:text-slate-400 shadow-xs"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Selected skills list */}
      {selectedSkills.length > 0 && (
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Selected Skills ({selectedSkills.length})
            </span>
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-[11px] font-semibold text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedSkills.map((skill) => (
              <SkillBadge
                key={skill.id}
                name={skill.name}
                removable
                onRemove={() => toggleSkill(skill)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Available skills picker */}
      <div>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
          Available Skills Catalog (Click to select)
        </span>
        <div className="flex flex-wrap gap-1.5 max-h-52 overflow-y-auto p-3.5 rounded-xl border border-slate-200 bg-white">
          {filtered.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 w-full text-center">
              No matching skills found.
            </p>
          ) : (
            filtered.map((skill) => (
              <SkillBadge
                key={skill.id}
                name={skill.name}
                selected={selectedSkills.some((s) => s.id === skill.id)}
                onClick={() => toggleSkill(skill)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
