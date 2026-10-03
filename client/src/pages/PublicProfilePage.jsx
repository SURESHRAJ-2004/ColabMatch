import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import PageLayout from '../components/layout/PageLayout';
import Badge from '../components/ui/Badge';
import SkillBadge from '../components/ui/SkillBadge';
import Spinner from '../components/ui/Spinner';

const experienceColors = {
  beginner: 'green',
  intermediate: 'blue',
  advanced: 'yellow',
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
    return <PageLayout><Spinner className="py-20" /></PageLayout>;
  }

  if (!profile) {
    return (
      <PageLayout>
        <p className="text-center text-text-secondary py-20">Profile not found.</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-border p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-primary-600 text-3xl">person</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl font-bold text-text-primary break-words">{profile.full_name}</h1>
                {profile.experience_level && (
                  <Badge color={experienceColors[profile.experience_level]}>
                    {profile.experience_level}
                  </Badge>
                )}
              </div>
              {profile.college && (
                <p className="text-sm text-text-secondary">{profile.college}</p>
              )}
              {profile.course && (
                <p className="text-xs text-text-muted mt-0.5">{profile.course}</p>
              )}
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-text-primary mb-1">About</h2>
              <p className="text-sm text-text-secondary">{profile.bio}</p>
            </div>
          )}

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-text-primary mb-2">Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((skill) => (
                  <SkillBadge key={skill.id} name={skill.name} />
                ))}
              </div>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            {profile.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary"
              >
                <span className="material-symbols-outlined text-lg">code</span>
                GitHub
              </a>
            )}
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary"
              >
                <span className="material-symbols-outlined text-lg">work</span>
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
