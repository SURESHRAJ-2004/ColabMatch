import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import PageLayout from '../components/layout/PageLayout';
import ProjectForm from '../components/project/ProjectForm';
import toast from 'react-hot-toast';

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
    >
      <div className="max-w-3xl mx-auto overflow-x-hidden">
        <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
          <div className="mb-6 pb-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Project Information</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Fill in the details below to publish your project and attract collaborator matches.
            </p>
          </div>
          <ProjectForm onSubmit={handleSubmit} loading={loading} submitLabel="Publish Project" />
        </div>
      </div>
    </PageLayout>
  );
}
