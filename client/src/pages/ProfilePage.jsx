import { useState, useEffect } from 'react';
import api from '../services/api';
import PageLayout from '../components/layout/PageLayout';
import ProfileForm from '../components/profile/ProfileForm';
import Skeleton from '../components/ui/Skeleton';
import toast from 'react-hot-toast';
import { UserCheck } from 'lucide-react';

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

      // Refetch to get updated profile
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
        <div className="max-w-3xl mx-auto space-y-4 w-full">
          <Skeleton className="w-full h-32 rounded-2xl" />
          <Skeleton className="w-full h-96 rounded-2xl" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="My Profile"
      description="Manage your student developer persona, tech skills, and contact links"
    >
      <div className="max-w-3xl mx-auto w-full overflow-x-hidden">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="mb-6 pb-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Profile Details</h2>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Keep your profile accurate to match with high-compatibility teams.
              </p>
            </div>
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Verified Student</span>
            </div>
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
