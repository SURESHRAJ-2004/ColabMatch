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
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Create Project
        </Link>
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {projects.map((project) => (
        <Link
          key={project.id}
          to={`/projects/${project.id}`}
          className="flex items-center justify-between p-3 rounded-lg border border-border bg-white hover:bg-surface-alt transition-colors gap-3"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-text-primary truncate">{project.title}</p>
            {project.category && (
              <p className="text-xs text-text-muted truncate">{project.category}</p>
            )}
          </div>
          <div className="shrink-0">
            <Badge color={statusColors[project.status]}>
              {statusLabels[project.status]}
            </Badge>
          </div>
        </Link>
      ))}
    </div>
  );
}
