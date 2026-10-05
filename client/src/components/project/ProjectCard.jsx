import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import SkillBadge from '../ui/SkillBadge';
import { Zap, Users, Tag, ArrowUpRight } from 'lucide-react';

const statusColors = {
  open: 'green',
  in_progress: 'blue',
  completed: 'gray',
};

const statusLabels = {
  open: 'Recruiting',
  in_progress: 'In Progress',
  completed: 'Completed',
};

export default function ProjectCard({ project, matchScore }) {
  const targetSeats = project.team_size || 4;

  return (
    <Link
      to={`/projects/${project.id}`}
      className="flex flex-col justify-between h-full bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-200 group"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <Badge color={statusColors[project.status] || 'gray'} size="xs" dot>
            {statusLabels[project.status] || project.status}
          </Badge>

          {matchScore !== undefined && matchScore > 0 && (
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold tabular-nums border ${
                matchScore >= 75
                  ? 'bg-emerald-50/80 text-emerald-700 border-emerald-200/70'
                  : matchScore >= 50
                  ? 'bg-blue-50/80 text-blue-700 border-blue-200/70'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>{matchScore}% match</span>
            </span>
          )}
        </div>

        {/* Title & Author */}
        <div className="mb-3">
          <div className="flex items-start justify-between gap-1.5">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-1 flex-1">
              {project.title}
            </h3>
            <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5" />
          </div>
          {project.owner && (
            <p className="text-xs text-slate-400 font-normal mt-0.5 truncate">
              Led by <span className="font-medium text-slate-600">{project.owner.full_name}</span>
            </p>
          )}
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed font-normal">
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
              <span className="text-[10px] font-semibold text-slate-400 self-center px-1.5 py-0.5 bg-slate-100 rounded-md border border-slate-200/60">
                +{project.skills.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Meta Footer */}
      <div className="flex items-center justify-between gap-3 text-xs text-slate-400 pt-3.5 border-t border-slate-100 mt-auto">
        <span className="flex items-center gap-1.5 font-medium truncate max-w-[170px]">
          <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{project.category || 'General'}</span>
        </span>
        <span className="flex items-center gap-1.5 font-medium shrink-0 text-slate-600 tabular-nums">
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span>{targetSeats} seats</span>
        </span>
      </div>
    </Link>
  );
}
