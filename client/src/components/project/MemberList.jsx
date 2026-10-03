import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';

export default function MemberList({ members, ownerId, currentUserId, onRemove }) {
  return (
    <div className="flex flex-col gap-2.5">
      {members.map((member) => {
        const profile = member.profiles || member;
        const isOwner = member.role === 'owner';
        return (
          <div
            key={member.profile_id || profile.id}
            className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 bg-white gap-3 shadow-xs"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-slate-500 text-lg">person</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  to={`/profile/${profile.id}`}
                  className="text-sm font-bold text-slate-900 hover:text-[#0f261f] transition-colors truncate block"
                >
                  {profile.full_name}
                </Link>
                {profile.college && (
                  <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{profile.college}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge color={isOwner ? 'dark' : 'blue'} size="xs">
                {isOwner ? 'Lead / Owner' : 'Member'}
              </Badge>
              {currentUserId === ownerId && !isOwner && onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(member.profile_id || profile.id)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Remove member"
                  aria-label="Remove member"
                >
                  <span className="material-symbols-outlined text-base">person_remove</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
