import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';

const statusColors = { pending: 'yellow', accepted: 'green', rejected: 'red' };

export default function JoinRequestsList({ requests, type = 'incoming' }) {
  if (!requests || requests.length === 0) {
    return (
      <EmptyState
        icon="mail"
        title={type === 'incoming' ? 'No pending requests' : 'No outgoing requests'}
        description={type === 'incoming'
          ? 'Join requests for your projects will appear here.'
          : 'Your project join requests will appear here.'}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {requests.map((request) => (
        <div
          key={request.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-border bg-white gap-2 sm:gap-3"
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {type === 'incoming' && request.profiles && (
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                {request.profiles.avatar_url ? (
                  <img
                    src={request.profiles.avatar_url}
                    alt={request.profiles.full_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-primary-600 text-sm">person</span>
                )}
              </div>
            )}
            <div className="min-w-0 flex-1">
              {type === 'incoming' ? (
                <>
                  <p className="text-sm font-medium text-text-primary truncate">
                    {request.profiles?.full_name} wants to join
                  </p>
                  <p className="text-xs text-text-muted truncate">{request.projects?.title}</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-text-primary truncate">
                    {request.projects?.title}
                  </p>
                  <p className="text-xs text-text-muted truncate">
                    by {request.projects?.profiles?.full_name || 'Owner'}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-border/50">
            <Badge color={statusColors[request.status]}>
              {request.status}
            </Badge>
            {type === 'incoming' && request.status === 'pending' && (
              <Link
                to={`/projects/${request.project_id || request.projects?.id}/requests`}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium px-2 py-0.5 rounded hover:bg-primary-50 transition-colors"
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
