import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import PageLayout from '../components/layout/PageLayout';
import Badge from '../components/ui/Badge';
import SkillBadge from '../components/ui/SkillBadge';
import Skeleton from '../components/ui/Skeleton';
import { ArrowLeft, GraduationCap, BookOpen, Code2 } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/ui/SocialIcons';
import { getInitials } from '../utils/helpers';

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
        <div className="max-w-3xl mx-auto space-y-4 w-full">
          <Skeleton className="w-full h-40 rounded-2xl" />
          <Skeleton className="w-full h-64 rounded-2xl" />
        </div>
      </PageLayout>
    );
  }

  if (!profile) {
    return (
      <PageLayout title="Profile Not Found" description="The requested developer profile does not exist">
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 max-w-xl mx-auto w-full">
          <p className="text-slate-500 text-sm mb-4">This profile does not exist or has been removed.</p>
          <Link
            to="/matches"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Matches</span>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const displayName = profile.full_name || 'Student Developer';

  return (
    <PageLayout
      title={displayName}
      description={profile.college || 'Student Developer Portfolio'}
      actions={
        <Link
          to="/matches"
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-xs shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Matches</span>
        </Link>
      }
    >
      <div className="max-w-3xl mx-auto space-y-6 w-full overflow-x-hidden">
        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-slate-100">
            <div className="w-18 h-18 rounded-2xl bg-slate-900 text-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-xs text-xl font-bold">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="w-18 h-18 object-cover"
                />
              ) : (
                <span>{getInitials(displayName)}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight break-words">
                  {displayName}
                </h1>
                {profile.experience_level && (
                  <Badge color={experienceColors[profile.experience_level] || 'gray'} size="xs" dot>
                    <span className="capitalize">{profile.experience_level}</span>
                  </Badge>
                )}
              </div>
              {profile.college && (
                <p className="text-xs sm:text-sm font-medium text-slate-700 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  <span>{profile.college}</span>
                </p>
              )}
              {profile.course && (
                <p className="text-xs text-slate-400 font-normal mt-0.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span>{profile.course}</span>
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
              <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                {profile.bio}
              </p>
            </div>
          )}

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="py-6 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Technical Stack & Skills</span>
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
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-100 hover:border-slate-300 transition-colors shadow-xs"
              >
                <GithubIcon className="w-4 h-4 text-slate-700" />
                <span>GitHub Profile</span>
              </a>
            )}
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-100 hover:border-slate-300 transition-colors shadow-xs"
              >
                <LinkedinIcon className="w-4 h-4 text-blue-600" />
                <span>LinkedIn Profile</span>
              </a>
            )}
            {!profile.github_url && !profile.linkedin_url && (
              <p className="text-xs text-slate-400">No external links provided.</p>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
