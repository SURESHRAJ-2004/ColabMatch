import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import SkillBadge from '../ui/SkillBadge';

const experienceColors = {
  beginner: 'green',
  intermediate: 'blue',
  advanced: 'yellow',
};

export default function ProfileCard({ profile, matchScore }) {
  return (
    <div className="bg-white rounded-xl border border-border p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <span className="material-symbols-outlined text-primary-600 text-xl">person</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`/profile/${profile.id}`}
              className="text-sm font-semibold text-text-primary hover:text-primary-600 truncate"
            >
              {profile.full_name}
            </Link>
            {profile.experience_level && (
              <Badge color={experienceColors[profile.experience_level]}>
                {profile.experience_level}
              </Badge>
            )}
            {matchScore !== undefined && (
              <Badge color={matchScore >= 75 ? 'green' : matchScore >= 50 ? 'blue' : 'gray'}>
                {matchScore}% match
              </Badge>
            )}
          </div>

          {profile.college && (
            <p className="text-xs text-text-secondary mt-0.5">{profile.college}</p>
          )}

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {profile.skills.slice(0, 5).map((skill) => (
                <SkillBadge key={skill.id} name={skill.name} />
              ))}
              {profile.skills.length > 5 && (
                <span className="text-xs text-text-muted self-center">
                  +{profile.skills.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
