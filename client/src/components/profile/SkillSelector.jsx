import { useState, useEffect } from 'react';
import api from '../../services/api';
import SkillBadge from '../ui/SkillBadge';
import Spinner from '../ui/Spinner';

export default function SkillSelector({ selectedSkills = [], onChange }) {
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/skills')
      .then((res) => setAllSkills(res.data))
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
    <div className="flex flex-col gap-3">
      {/* Search Input */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
          search
        </span>
        <input
          type="text"
          placeholder="Filter technical skills (e.g. React, Node.js, Python)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10.5 pl-10 pr-9 rounded-xl border border-slate-200/90 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f261f]/15 focus:border-[#0f261f] bg-white text-slate-900 placeholder:text-slate-400 shadow-xs"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            aria-label="Clear search"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        )}
      </div>

      {/* Selected skills list */}
      {selectedSkills.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Selected Skills ({selectedSkills.length})
            </span>
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-[11px] font-semibold text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
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
          Available Skills
        </span>
        <div className="flex flex-wrap gap-1.5 max-h-52 overflow-y-auto p-3.5 rounded-2xl border border-slate-200/80 bg-white">
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
