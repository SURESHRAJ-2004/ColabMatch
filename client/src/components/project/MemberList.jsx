import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import { UserMinus, Crown, GraduationCap } from 'lucide-react';
import { getInitials } from '../../utils/helpers';

export default function MemberList({ members, ownerId, currentUserId, onRemove }) {
  return (
    <div className="flex flex-col gap-2.5">
      {members.map((member) => {
        const profile = member.profiles || member;
        const isOwner = member.role === 'owner';
        const displayName = profile.full_name || 'Collaborator';

        return (
          <div
            key={member.profile_id || profile.id}
            className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-slate-200/80 bg-white gap-3 shadow-xs hover:border-slate-300 transition-all"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden text-xs font-bold shadow-2xs">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="w-9 h-9 object-cover"
                  />
                ) : (
                  <span>{getInitials(displayName)}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <Link
                    to={`/profile/${profile.id}`}
                    className="text-sm font-semibold text-slate-900 hover:text-emerald-700 transition-colors truncate block"
                  >
                    {displayName}
                  </Link>
                  {isOwner && (
                    <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />
                  )}
                </div>
                {profile.college && (
                  <p className="text-xs text-slate-400 font-normal truncate mt-0.5 flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-slate-400" />
                    <span>{profile.college}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge color={isOwner ? 'dark' : 'blue'} size="xs" dot>
                {isOwner ? 'Project Lead' : 'Team Member'}
              </Badge>
              {currentUserId === ownerId && !isOwner && onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(member.profile_id || profile.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Remove member"
                  aria-label="Remove member"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
