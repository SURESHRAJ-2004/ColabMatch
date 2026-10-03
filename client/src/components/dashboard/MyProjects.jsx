import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';

const statusColors = { open: 'green', in_progress: 'blue', completed: 'gray' };
const statusLabels = { open: 'Open', in_progress: 'In Progress', completed: 'Completed' };

export default function MyProjects({ projects }) {
  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        icon="folder_off"
        title="No projects yet"
        description="Create your first project to start finding collaborators."
      >
        <Link
          to="/projects/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f261f] text-white text-xs font-bold hover:bg-[#18362c] transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Create Project
        </Link>
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {projects.map((project) => (
        <Link
          key={project.id}
          to={`/projects/${project.id}`}
          className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs transition-all gap-3 group"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 group-hover:text-[#0f261f] transition-colors truncate">
              {project.title}
            </p>
            {project.category && (
              <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                {project.category}
              </p>
            )}
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <Badge color={statusColors[project.status] || 'gray'} size="xs">
              {statusLabels[project.status] || project.status}
            </Badge>
            <span className="material-symbols-outlined text-slate-300 text-lg group-hover:text-slate-600 transition-colors">
              chevron_right
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
