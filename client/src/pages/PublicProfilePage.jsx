import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import PageLayout from '../components/layout/PageLayout';
import Badge from '../components/ui/Badge';
import SkillBadge from '../components/ui/SkillBadge';
import Spinner from '../components/ui/Spinner';

const experienceColors = {
  beginner: 'green',
  intermediate: 'blue',
  advanced: 'orange',
};

export default function PublicProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/profiles/${id}`)
      .then((res) => setProfile(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <PageLayout title="Developer Profile" description="Loading profile...">
        <Spinner className="py-24" />
      </PageLayout>
    );
  }

  if (!profile) {
    return (
      <PageLayout title="Profile Not Found" description="The requested developer profile does not exist">
        <p className="text-center text-slate-500 py-24">Profile not found.</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={profile.full_name}
      description={profile.college || 'Student Developer Portfolio'}
      actions={
        <Link
          to="/matches"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to Matches
        </Link>
      }
    >
      <div className="max-w-3xl mx-auto space-y-6 overflow-x-hidden">
        {/* Main Profile Card */}
        <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-slate-100">
            <div className="w-[72px] h-[72px] rounded-[22px] bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-[72px] h-[72px] object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-slate-400 text-4xl">person</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight break-words">
                  {profile.full_name}
                </h1>
                {profile.experience_level && (
                  <Badge color={experienceColors[profile.experience_level] || 'gray'} size="xs">
                    {profile.experience_level} level
                  </Badge>
                )}
              </div>
              {profile.college && (
                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                  {profile.college}
                </p>
              )}
              {profile.course && (
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {profile.course}
                </p>
              )}
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="py-6 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                About the Developer
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="py-6 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Technical Skills & Tools
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <SkillBadge key={skill.id} name={skill.name} />
                ))}
              </div>
            </div>
          )}

          {/* External Links */}
          <div className="pt-6 flex flex-wrap gap-3">
            {profile.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-base">code</span>
                GitHub Profile
              </a>
            )}
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-base">work</span>
                LinkedIn Profile
              </a>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
