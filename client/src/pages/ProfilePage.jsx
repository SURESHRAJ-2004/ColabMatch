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
      toast.success('Profile updated successfully!');
    } catch (err) {
      const msg =
        err.response?.data?.details?.[0]?.message ||
        err.response?.data?.error ||
        'Failed to update profile';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageLayout title="My Profile" description="Loading profile...">
        <Spinner className="py-24" />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="My Profile"
      description="Manage your student developer persona, tech skills, and contact links"
    >
      <div className="max-w-3xl mx-auto overflow-x-hidden">
        <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
          <div className="mb-6 pb-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Profile Details</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Keep your profile accurate to get matched with high-compatibility teams.
            </p>
          </div>
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
