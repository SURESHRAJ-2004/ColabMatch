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
    <PageLayout
      title="Projects"
      description={`Discover ${total} active collaborative project${total !== 1 ? 's' : ''}`}
      actions={
        <Link
          to="/projects/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f261f] text-white text-xs sm:text-sm font-bold hover:bg-[#18362c] transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-base">add</span>
          New Project
        </Link>
      }
    >
      <div className="space-y-6 overflow-x-hidden">
        <ProjectFilters filters={filters} onChange={setFilters} />

        <div>
          {loading ? (
            <Spinner className="py-24" />
          ) : projects.length === 0 ? (
            <EmptyState
              icon="search_off"
              title="No projects found"
              description="No projects match your current filter criteria. Try adjusting the search keywords or filters."
            >
              <Link
                to="/projects/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f261f] text-white text-xs font-bold hover:bg-[#18362c] transition-all shadow-xs mt-2"
              >
                <span className="material-symbols-outlined text-base">add</span>
                Create This Project
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
