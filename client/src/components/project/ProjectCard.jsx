import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import SkillBadge from '../ui/SkillBadge';

const statusColors = {
  open: 'green',
  in_progress: 'blue',
  completed: 'gray',
};

const statusLabels = {
  open: 'Open',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export default function ProjectCard({ project, matchScore }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="flex flex-col justify-between h-full bg-white rounded-[26px] border border-slate-200/80 p-5 sm:p-6 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all duration-200 group"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <Badge color={statusColors[project.status] || 'gray'}>
            {statusLabels[project.status] || project.status}
          </Badge>
          {matchScore !== undefined && matchScore > 0 && (
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                matchScore >= 75
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                  : matchScore >= 50
                  ? 'bg-blue-50 text-blue-700 border-blue-200/70'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-[13px]">bolt</span>
              {matchScore}% match
            </span>
          )}
        </div>

        {/* Title & Author */}
        <div className="mb-3">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0f261f] transition-colors leading-snug line-clamp-1">
            {project.title}
          </h3>
          {project.owner && (
            <p className="text-xs font-medium text-slate-400 mt-0.5 truncate">
              Lead by {project.owner.full_name}
            </p>
          )}
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-xs sm:text-[13px] text-slate-500 line-clamp-2 mb-4 leading-relaxed font-normal">
            {project.description}
          </p>
        )}

        {/* Skills */}
        {project.skills && project.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.skills.slice(0, 4).map((skill) => (
              <SkillBadge key={skill.id} name={skill.name} size="xs" />
            ))}
            {project.skills.length > 4 && (
              <span className="text-[11px] font-semibold text-slate-400 self-center px-1.5 py-0.5 bg-slate-50 rounded-full border border-slate-200/60">
                +{project.skills.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Meta Footer */}
      <div className="flex items-center justify-between gap-3 text-xs text-slate-400 pt-3.5 border-t border-slate-100 mt-auto">
        <span className="flex items-center gap-1.5 font-medium truncate max-w-[170px]">
          <span className="material-symbols-outlined text-sm text-slate-400">category</span>
          <span className="truncate">{project.category || 'General'}</span>
        </span>
        <span className="flex items-center gap-1.5 font-medium shrink-0 text-slate-500">
          <span className="material-symbols-outlined text-sm text-slate-400">group</span>
          {project.team_size || 4} seats
        </span>
      </div>
    </Link>
  );
}
