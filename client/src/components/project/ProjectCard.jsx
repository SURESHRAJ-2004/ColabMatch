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
      className="flex flex-col justify-between h-full bg-white rounded-xl border border-border p-4 sm:p-5 hover:shadow-sm hover:border-primary-200 transition-all group"
    >
      <div>
        <div className="flex items-start justify-between gap-2.5 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary-600 transition-colors truncate">
              {project.title}
            </h3>
            {project.owner && (
              <p className="text-xs text-text-secondary mt-0.5 truncate">
                by {project.owner.full_name}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
            <Badge color={statusColors[project.status]}>
              {statusLabels[project.status]}
            </Badge>
            {matchScore !== undefined && matchScore > 0 && (
              <Badge color={matchScore >= 75 ? 'green' : matchScore >= 50 ? 'blue' : 'gray'}>
                {matchScore}%
              </Badge>
            )}
          </div>
        </div>

        {project.description && (
          <p className="text-xs text-text-secondary line-clamp-2 mb-3">
            {project.description}
          </p>
        )}

        {/* Skills */}
        {project.skills && project.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.skills.slice(0, 4).map((skill) => (
              <SkillBadge key={skill.id} name={skill.name} />
            ))}
            {project.skills.length > 4 && (
              <span className="text-xs text-text-muted self-center ml-0.5">
                +{project.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between gap-3 text-xs text-text-muted pt-3 border-t border-border/60 mt-auto flex-wrap">
        {project.category ? (
          <span className="flex items-center gap-1 truncate max-w-[160px]">
            <span className="material-symbols-outlined text-sm">category</span>
            <span className="truncate">{project.category}</span>
          </span>
        ) : <span />}
        <span className="flex items-center gap-1 shrink-0">
          <span className="material-symbols-outlined text-sm">group</span>
          {project.team_size} members
        </span>
      </div>
    </Link>
  );
}
