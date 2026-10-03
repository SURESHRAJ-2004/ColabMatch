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
      toast.success('Project created!');
      navigate(`/projects/${data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Create Project</h1>
        <div className="bg-white rounded-xl border border-border p-6">
          <ProjectForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </PageLayout>
  );
}
