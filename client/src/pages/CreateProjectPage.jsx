import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import PageLayout from '../components/layout/PageLayout';
import ProjectForm from '../components/project/ProjectForm';
import toast from 'react-hot-toast';
import { ArrowLeft, FolderPlus } from 'lucide-react';

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const { data } = await api.post('/projects', formData);
      toast.success('Project created successfully!');
      navigate(`/projects/${data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title="Create New Project"
      description="Post your initiative, specify team size, and list required skills"
      actions={
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>
      }
    >
      <div className="max-w-3xl mx-auto overflow-x-hidden">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="mb-6 pb-5 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <FolderPlus className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">Project Overview</h2>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Fill in the details below to publish your capstone project and attract collaborator matches.
              </p>
            </div>
          </div>
          <ProjectForm onSubmit={handleSubmit} loading={loading} submitLabel="Publish Project" />
        </div>
      </div>
    </PageLayout>
  );
}
