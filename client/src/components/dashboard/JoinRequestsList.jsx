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
          className="flex items-center justify-between p-3 rounded-lg border border-border bg-white"
        >
          <div className="flex items-center gap-3">
            {type === 'incoming' && request.profiles && (
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
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
            <div>
              {type === 'incoming' ? (
                <>
                  <p className="text-sm font-medium text-text-primary">
                    {request.profiles?.full_name} wants to join
                  </p>
                  <p className="text-xs text-text-muted">{request.projects?.title}</p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-text-primary">
                    {request.projects?.title}
                  </p>
                  <p className="text-xs text-text-muted">
                    by {request.projects?.profiles?.full_name}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge color={statusColors[request.status]}>
              {request.status}
            </Badge>
            {type === 'incoming' && request.status === 'pending' && (
              <Link
                to={`/projects/${request.project_id || request.projects?.id}/requests`}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
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
