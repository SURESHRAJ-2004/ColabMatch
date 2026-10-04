import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PageLayout from '../components/layout/PageLayout';
import ProjectForm from '../components/project/ProjectForm';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

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
        <Spinner className="py-24" />
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout title="Edit Project" description="Project not found">
        <p className="text-center text-slate-500 py-24">Project not found or deleted.</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Edit Project"
      description={`Update settings for "${project.title}"`}
    >
      <div className="max-w-3xl mx-auto overflow-x-hidden">
        <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
          <div className="mb-6 pb-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Modify Project Settings</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Change project title, description, status, team capacity, and required skills.
            </p>
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
