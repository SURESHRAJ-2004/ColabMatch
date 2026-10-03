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

  if (loading) return <Spinner size="sm" />;

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Search skills..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      />

      {/* Selected skills */}
      {selectedSkills.length > 0 && (
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
      )}

      {/* Available skills */}
      <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
        {filtered.map((skill) => (
          <SkillBadge
            key={skill.id}
            name={skill.name}
            selected={selectedSkills.some((s) => s.id === skill.id)}
            onClick={() => toggleSkill(skill)}
          />
        ))}
      </div>
    </div>
  );
}
