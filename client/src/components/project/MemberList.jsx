import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';

export default function MemberList({ members, ownerId, currentUserId, onRemove }) {
  return (
    <div className="flex flex-col gap-2">
      {members.map((member) => {
        const profile = member.profiles || member;
        return (
          <div
            key={member.profile_id || profile.id}
            className="flex items-center justify-between p-3 rounded-lg border border-border bg-white gap-3"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-primary-600 text-base">person</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  to={`/profile/${profile.id}`}
                  className="text-sm font-medium text-text-primary hover:text-primary-600 truncate block"
                >
                  {profile.full_name}
                </Link>
                {profile.college && (
                  <p className="text-xs text-text-muted truncate">{profile.college}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge color={member.role === 'owner' ? 'yellow' : 'blue'}>
                {member.role}
              </Badge>
              {currentUserId === ownerId &&
                member.role !== 'owner' &&
                onRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(member.profile_id || profile.id)}
                    className="p-1 rounded hover:bg-red-50 text-text-muted hover:text-danger transition-colors cursor-pointer"
                    title="Remove member"
                  >
                    <span className="material-symbols-outlined text-lg">person_remove</span>
                  </button>
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
