import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PageLayout from '../components/layout/PageLayout';
import ProjectCard from '../components/project/ProjectCard';
import ProjectFilters from '../components/project/ProjectFilters';
import { CardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { Plus, SearchX } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '', status: '' });

  const fetchProjects = useCallback(async (currentFilters) => {
    try {
      const params = new URLSearchParams();
      if (currentFilters.search) params.append('search', currentFilters.search);
      if (currentFilters.category) params.append('category', currentFilters.category);
      if (currentFilters.status) params.append('status', currentFilters.status);

      const { data } = await api.get(`/projects?${params.toString()}`);
      setProjects(data.projects || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects(filters);
  }, [filters, fetchProjects]);

  return (
    <PageLayout
      title="Projects Directory"
      description={`Discover ${total} active collaborative project${total !== 1 ? 's' : ''} looking for teammates`}
      actions={
        <Link
          to="/projects/new"
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </Link>
      }
    >
      <div className="space-y-6 overflow-x-hidden">
        <ProjectFilters
          filters={filters}
          onChange={(newFilters) => {
            setLoading(true);
            setFilters(newFilters);
          }}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-500 font-medium px-1">
          <span>Showing <strong className="text-slate-900 font-bold tabular-nums">{projects.length}</strong> of <strong className="text-slate-900 font-bold tabular-nums">{total}</strong> projects</span>
          {(filters.search || filters.category || filters.status) && (
            <span className="text-emerald-700 font-semibold">Active filters applied</span>
          )}
        </div>

        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No projects match criteria"
              description="No projects match your current filter parameters. Try clearing the search or category filter."
            >
              <Link
                to="/projects/new"
                className="inline-flex items-center gap-1.5 h-9.5 px-4 mt-2 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create This Project</span>
              </Link>
            </EmptyState>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
