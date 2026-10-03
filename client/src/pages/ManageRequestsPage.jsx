import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import PageLayout from '../components/layout/PageLayout';
import Badge from '../components/ui/Badge';
import SkillBadge from '../components/ui/SkillBadge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

const statusColors = { pending: 'yellow', accepted: 'green', rejected: 'red' };

export default function ManageRequestsPage() {
  const { id } = useParams();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(null);

  const fetchRequests = () => {
    api.get(`/projects/${id}/requests`)
      .then((res) => setRequests(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRequests(); }, [id]);

  const handleRespond = async (requestId, action) => {
    setResponding(requestId);
    try {
      await api.put(`/requests/${requestId}`, { action });
      toast.success(`Request ${action}ed`);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.error || `Failed to ${action} request`);
    } finally {
      setResponding(null);
    }
  };

  if (loading) {
    return <PageLayout><Spinner className="py-20" /></PageLayout>;
  }

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link
            to={`/projects/${id}`}
            className="p-2 rounded-lg hover:bg-surface-alt text-text-muted"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">Join Requests</h1>
        </div>

        {requests.length === 0 ? (
          <EmptyState
            icon="mail"
            title="No join requests"
            description="When students request to join your project, they'll appear here."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-xl border border-border p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                      {request.profiles?.avatar_url ? (
                        <img
                          src={request.profiles.avatar_url}
                          alt={request.profiles.full_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-primary-600">person</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          to={`/profile/${request.profiles?.id}`}
                          className="text-sm font-semibold text-text-primary hover:text-primary-600 truncate"
                        >
                          {request.profiles?.full_name}
                        </Link>
                        <Badge color={statusColors[request.status]}>
                          {request.status}
                        </Badge>
                      </div>
                      {request.profiles?.college && (
                        <p className="text-xs text-text-muted mt-0.5 truncate">
                          {request.profiles.college} • {request.profiles.experience_level}
                        </p>
                      )}
                      {request.message && (
                        <p className="text-sm text-text-secondary mt-2 break-words bg-surface-alt p-2.5 rounded-lg border border-border/50 text-xs sm:text-sm">{request.message}</p>
                      )}
                      {/* Requester skills */}
                      {request.requester_skills && request.requester_skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {request.requester_skills.map((skill) => (
                            <SkillBadge key={skill.id} name={skill.name} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
                      <Button
                        variant="success"
                        size="sm"
                        className="flex-1 sm:flex-initial justify-center"
                        onClick={() => handleRespond(request.id, 'accept')}
                        loading={responding === request.id}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="flex-1 sm:flex-initial justify-center"
                        onClick={() => handleRespond(request.id, 'reject')}
                        loading={responding === request.id}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
