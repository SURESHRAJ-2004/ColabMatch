import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';
import { FolderGit2, Plus, ChevronRight, Tag } from 'lucide-react';

const statusColors = { open: 'green', in_progress: 'blue', completed: 'gray' };
const statusLabels = { open: 'Recruiting', in_progress: 'In Progress', completed: 'Completed' };

export default function MyProjects({ projects }) {
  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        icon={FolderGit2}
        title="No projects created yet"
        description="Launch your capstone project or startup idea to start discovering matching teammates."
      >
        <Link
          to="/projects/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
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
          className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs transition-all gap-3 group"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                {project.title}
              </p>
            </div>
            {project.category && (
              <p className="text-xs text-slate-400 font-normal truncate mt-0.5 flex items-center gap-1">
                <Tag className="w-3 h-3 text-slate-400" />
                <span>{project.category}</span>
              </p>
            )}
          </div>
          <div className="shrink-0 flex items-center gap-2.5">
            <Badge
              color={statusColors[project.status] || 'gray'}
              size="xs"
              dot
            >
              {statusLabels[project.status] || project.status}
            </Badge>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      ))}
    </div>
  );
}
