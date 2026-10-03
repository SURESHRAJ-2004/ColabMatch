import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';

const statusColors = { pending: 'orange', accepted: 'green', rejected: 'red' };

export default function JoinRequestsList({ requests, type = 'incoming' }) {
  if (!requests || requests.length === 0) {
    return (
      <EmptyState
        icon="mark_email_unread"
        title={type === 'incoming' ? 'No pending requests' : 'No active applications'}
        description={
          type === 'incoming'
            ? 'Incoming requests to join your project teams will appear here.'
            : 'Applications you send to join other projects will appear here.'
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {requests.map((request) => (
        <div
          key={request.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-200/80 bg-white gap-3 shadow-xs hover:border-slate-300 transition-all"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {type === 'incoming' && request.profiles && (
              <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                {request.profiles.avatar_url ? (
                  <img
                    src={request.profiles.avatar_url}
                    alt={request.profiles.full_name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-slate-500 text-base">person</span>
                )}
              </div>
            )}
            <div className="min-w-0 flex-1">
              {type === 'incoming' ? (
                <>
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {request.profiles?.full_name}
                  </p>
                  <p className="text-xs text-slate-400 font-medium truncate">
                    Requested to join <span className="text-slate-700">{request.projects?.title}</span>
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {request.projects?.title}
                  </p>
                  <p className="text-xs text-slate-400 font-medium truncate">
                    Led by {request.projects?.profiles?.full_name || 'Project Lead'}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <Badge color={statusColors[request.status] || 'gray'} size="xs">
              {request.status}
            </Badge>
            {type === 'incoming' && request.status === 'pending' && (
              <Link
                to={`/projects/${request.project_id || request.projects?.id}/requests`}
                className="text-xs font-bold text-white bg-[#0f261f] hover:bg-[#18362c] px-3 py-1.5 rounded-xl transition-all shadow-xs"
              >
                Review
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
