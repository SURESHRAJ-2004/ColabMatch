import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import SkillBadge from '../ui/SkillBadge';
import { Zap, Eye, GraduationCap } from 'lucide-react';
import { getInitials } from '../../utils/helpers';

const experienceColors = {
  beginner: 'green',
  intermediate: 'blue',
  advanced: 'orange',
};

export default function ProfileCard({ profile, matchScore }) {
  const displayName = profile.full_name || 'Student Developer';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between group w-full">
      <div>
        <div className="flex items-start gap-3.5 mb-4">
          {/* Avatar */}
          <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden shadow-2xs text-xs font-bold">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-11 h-11 object-cover"
              />
            ) : (
              <span>{getInitials(displayName)}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <Link
                to={`/profile/${profile.id}`}
                className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate min-w-0 flex-1"
              >
                {displayName}
              </Link>
              {matchScore !== undefined && matchScore > 0 && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold tabular-nums border shrink-0 ${
                    matchScore >= 75
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : matchScore >= 50
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <Zap className="w-3 h-3 fill-current" />
                  <span>{matchScore}% match</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {profile.experience_level && (
                <Badge color={experienceColors[profile.experience_level] || 'gray'} size="xs" dot>
                  <span className="capitalize">{profile.experience_level}</span>
                </Badge>
              )}
              {profile.college && (
                <span className="text-xs text-slate-400 max-w-[160px] inline-flex items-center gap-1 min-w-0">
                  <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{profile.college}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-xs sm:text-[13px] text-slate-500 line-clamp-2 mb-4 leading-relaxed font-normal">
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
              <span className="text-[10px] font-semibold text-slate-400 self-center px-1.5 py-0.5 bg-slate-100 rounded-md border border-slate-200">
                +{profile.skills.length - 5}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="pt-3.5 border-t border-slate-100 mt-auto">
        <Link
          to={`/profile/${profile.id}`}
          className="w-full h-9 inline-flex items-center justify-center gap-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 text-xs font-semibold transition-all shadow-xs"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Profile</span>
        </Link>
      </div>
    </div>
  );
}
