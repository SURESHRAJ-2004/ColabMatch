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

const statusColors = { pending: 'orange', accepted: 'green', rejected: 'red' };

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
    return (
      <PageLayout title="Manage Requests" description="Loading candidate requests...">
        <Spinner className="py-24" />
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Team Join Requests"
      description="Review student applications and accept new collaborators into your project"
      actions={
        <Link
          to={`/projects/${id}`}
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to Project
        </Link>
      }
    >
      <div className="max-w-3xl mx-auto overflow-x-hidden">
        {requests.length === 0 ? (
          <EmptyState
            icon="mark_email_read"
            title="No pending requests"
            description="When peers request to join your project, their applications and messages will show up here for review."
          />
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-[26px] border border-slate-200/80 p-5 sm:p-6 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                      {request.profiles?.avatar_url ? (
                        <img
                          src={request.profiles.avatar_url}
                          alt={request.profiles.full_name}
                          className="w-11 h-11 rounded-2xl object-cover"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-slate-500 text-xl">
                          person
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Link
                          to={`/profile/${request.profiles?.id}`}
                          className="text-sm font-bold text-slate-900 hover:text-[#0f261f] transition-colors truncate"
                        >
                          {request.profiles?.full_name}
                        </Link>
                        <Badge color={statusColors[request.status] || 'gray'} size="xs">
                          {request.status}
                        </Badge>
                      </div>

                      {request.profiles?.college && (
                        <p className="text-xs text-slate-400 font-medium truncate">
                          {request.profiles.college}
                          {request.profiles.experience_level && ` • ${request.profiles.experience_level} level`}
                        </p>
                      )}

                      {/* Intro Message */}
                      {request.message && (
                        <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Note from applicant:
                          </p>
                          {request.message}
                        </div>
                      )}

                      {/* Requester Skills */}
                      {request.requester_skills && request.requester_skills.length > 0 && (
                        <div className="mt-3.5">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                            Applicant Skills:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {request.requester_skills.map((skill) => (
                              <SkillBadge key={skill.id} name={skill.name} size="xs" />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <Button
                        variant="success"
                        size="sm"
                        className="flex-1 sm:flex-initial"
                        onClick={() => handleRespond(request.id, 'accept')}
                        loading={responding === request.id}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1 sm:flex-initial text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRespond(request.id, 'reject')}
                        loading={responding === request.id}
                      >
                        Decline
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
