import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';
import { Mail, Send, ArrowRight } from 'lucide-react';
import { getInitials } from '../../utils/helpers';

const statusColors = { pending: 'orange', accepted: 'green', rejected: 'red' };
const statusLabels = { pending: 'Pending Review', accepted: 'Accepted', rejected: 'Declined' };

export default function JoinRequestsList({ requests, type = 'incoming' }) {
  if (!requests || requests.length === 0) {
    return (
      <EmptyState
        icon={type === 'incoming' ? Mail : Send}
        title={type === 'incoming' ? 'No pending requests' : 'No active applications'}
        description={
          type === 'incoming'
            ? 'Incoming requests from students wanting to join your teams will appear here.'
            : 'Applications you submit to join peer projects will appear here.'
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {requests.map((request) => {
        const applicantName = request.profiles?.full_name || 'Applicant';
        const avatarUrl = request.profiles?.avatar_url;

        return (
          <div
            key={request.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-xl border border-slate-200/80 bg-white gap-3 shadow-xs hover:border-slate-300 transition-all"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {type === 'incoming' && (
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 overflow-hidden text-xs font-bold">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={applicantName}
                      className="w-8 h-8 object-cover"
                    />
                  ) : (
                    <span>{getInitials(applicantName)}</span>
                  )}
                </div>
              )}
              <div className="min-w-0 flex-1">
                {type === 'incoming' ? (
                  <>
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {applicantName}
                    </p>
                    <p className="text-xs text-slate-400 font-normal truncate">
                      Requested to join <span className="font-medium text-slate-700">{request.projects?.title}</span>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {request.projects?.title}
                    </p>
                    <p className="text-xs text-slate-400 font-normal truncate">
                      Led by <span className="font-medium text-slate-700">{request.projects?.profiles?.full_name || 'Project Lead'}</span>
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <Badge
                color={statusColors[request.status] || 'gray'}
                size="xs"
                dot
              >
                {statusLabels[request.status] || request.status}
              </Badge>
              {type === 'incoming' && request.status === 'pending' && (
                <Link
                  to={`/projects/${request.project_id || request.projects?.id}/requests`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-all shadow-xs"
                >
                  <span>Review</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
