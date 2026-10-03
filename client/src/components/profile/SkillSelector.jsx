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
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
          search
        </span>
        <input
          type="text"
          placeholder="Search and select technical skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f261f]/10 focus:border-[#0f261f] bg-white text-slate-900 placeholder:text-slate-400 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
        />
      </div>

      {/* Selected skills list */}
      {selectedSkills.length > 0 && (
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            Selected Skills ({selectedSkills.length})
          </p>
          <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
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
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
          Available Skills
        </p>
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-3 rounded-2xl border border-slate-200/80 bg-white">
          {filtered.length === 0 ? (
            <p className="text-xs text-slate-400 py-3 w-full text-center">No matching skills found.</p>
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
