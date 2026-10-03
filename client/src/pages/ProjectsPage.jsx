import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PageLayout from '../components/layout/PageLayout';
import ProjectCard from '../components/project/ProjectCard';
import ProjectFilters from '../components/project/ProjectFilters';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '', status: '' });

  const fetchProjects = async (currentFilters) => {
    setLoading(true);
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
  };

  useEffect(() => {
    fetchProjects(filters);
  }, [filters]);

  return (
    <PageLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Projects</h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            {total} project{total !== 1 ? 's' : ''} available
          </p>
        </div>
        <Link
          to="/projects/new"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors self-start sm:self-auto shrink-0 shadow-xs"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          New Project
        </Link>
      </div>

      <ProjectFilters filters={filters} onChange={setFilters} />

      <div className="mt-6">
        {loading ? (
          <Spinner className="py-20" />
        ) : projects.length === 0 ? (
          <EmptyState
            icon="search_off"
            title="No projects found"
            description="Try adjusting your filters or create a new project."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
