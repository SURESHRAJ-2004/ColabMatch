import { useState, useEffect } from 'react';
import api from '../services/api';
import PageLayout from '../components/layout/PageLayout';
import ProfileForm from '../components/profile/ProfileForm';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/profiles/me')
      .then((res) => setProfile(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (formData, skills) => {
    setSaving(true);
    try {
      // Update profile
      await api.put('/profiles/me', formData);

      // Update skills
      const skillIds = skills.map((s) => s.id);
      await api.put('/profiles/me/skills', { skill_ids: skillIds });

      // Refetch to get updated skills
      const { data: freshProfile } = await api.get('/profiles/me');
      setProfile(freshProfile);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <Spinner className="py-20" />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Edit Profile</h1>
        <div className="bg-white rounded-xl border border-border p-6">
          <ProfileForm
            profile={profile}
            onSubmit={handleSubmit}
            loading={saving}
          />
        </div>
      </div>
    </PageLayout>
  );
}
