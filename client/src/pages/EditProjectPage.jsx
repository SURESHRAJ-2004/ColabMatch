import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import PageLayout from '../components/layout/PageLayout';
import ProjectForm from '../components/project/ProjectForm';
import Skeleton from '../components/ui/Skeleton';
import toast from 'react-hot-toast';
import { ArrowLeft, Settings2 } from 'lucide-react';

export default function EditProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/projects/${id}`)
      .then((res) => setProject(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      await api.put(`/projects/${id}`, formData);
      toast.success('Project updated successfully!');
      navigate(`/projects/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageLayout title="Edit Project" description="Loading project details...">
        <div className="max-w-3xl mx-auto space-y-4 w-full">
          <Skeleton className="w-full h-24 rounded-2xl" />
          <Skeleton className="w-full h-96 rounded-2xl" />
        </div>
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout title="Edit Project" description="Project not found">
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 max-w-xl mx-auto w-full">
          <p className="text-slate-500 text-sm mb-4">Project not found or deleted.</p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Projects</span>
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Edit Project"
      description={`Update settings for "${project.title}"`}
      actions={
        <Link
          to={`/projects/${id}`}
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-xs shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Project</span>
        </Link>
      }
    >
      <div className="max-w-3xl mx-auto w-full overflow-x-hidden">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="mb-6 pb-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs shrink-0">
              <Settings2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Modify Project Settings</h2>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Update project title, description, status, team capacity, and required skills.
              </p>
            </div>
          </div>
          <ProjectForm
            project={project}
            onSubmit={handleSubmit}
            loading={saving}
            submitLabel="Save Changes"
          />
        </div>
      </div>
    </PageLayout>
  );
}
