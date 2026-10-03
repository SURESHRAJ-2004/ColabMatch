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
      toast.success('Project updated!');
      navigate(`/projects/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <PageLayout><Spinner className="py-20" /></PageLayout>;
  }

  if (!project) {
    return (
      <PageLayout>
        <p className="text-center text-text-secondary py-20">Project not found.</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Edit Project</h1>
        <div className="bg-white rounded-xl border border-border p-6">
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
