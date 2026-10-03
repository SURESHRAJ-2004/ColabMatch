import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import SkillBadge from '../ui/SkillBadge';

const experienceColors = {
  beginner: 'green',
  intermediate: 'blue',
  advanced: 'orange',
};

export default function ProfileCard({ profile, matchScore }) {
  return (
    <div className="bg-white rounded-[26px] border border-slate-200/80 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-slate-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-200 flex flex-col justify-between">
      <div>
        <div className="flex items-start gap-3.5 mb-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden shadow-xs">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-12 h-12 rounded-2xl object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-slate-500 text-2xl">person</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <Link
                to={`/profile/${profile.id}`}
                className="text-sm font-bold text-slate-900 hover:text-[#0f261f] transition-colors truncate"
              >
                {profile.full_name}
              </Link>
              {matchScore !== undefined && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                    matchScore >= 75
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                      : matchScore >= 50
                      ? 'bg-blue-50 text-blue-700 border-blue-200/70'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">bolt</span>
                  {matchScore}% match
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {profile.experience_level && (
                <Badge color={experienceColors[profile.experience_level] || 'gray'} size="xs">
                  {profile.experience_level}
                </Badge>
              )}
              {profile.college && (
                <span className="text-xs text-slate-500 truncate max-w-[180px]">
                  {profile.college}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed font-normal">
            {profile.bio}
          </p>
        )}

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {profile.skills.slice(0, 5).map((skill) => (
              <SkillBadge key={skill.id} name={skill.name} size="xs" />
            ))}
            {profile.skills.length > 5 && (
              <span className="text-[11px] font-semibold text-slate-400 self-center px-1.5 py-0.5 bg-slate-50 rounded-full border border-slate-200/60">
                +{profile.skills.length - 5}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="pt-3.5 border-t border-slate-100 mt-auto flex items-center justify-between">
        <Link
          to={`/profile/${profile.id}`}
          className="text-xs font-bold text-[#0f261f] hover:underline flex items-center gap-1"
        >
          View Profile
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
