import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import PageLayout from '../components/layout/PageLayout';
import Badge from '../components/ui/Badge';
import SkillBadge from '../components/ui/SkillBadge';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';
import { ArrowLeft, Check, X, MessageSquare, MailCheck, GraduationCap } from 'lucide-react';
import { getInitials } from '../utils/helpers';

const statusColors = { pending: 'orange', accepted: 'green', rejected: 'red' };
const statusLabels = { pending: 'Pending Decision', accepted: 'Accepted to Team', rejected: 'Declined' };

export default function ManageRequestsPage() {
  const { id } = useParams();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState(null);

  const fetchRequests = useCallback(() => {
    api.get(`/projects/${id}/requests`)
      .then((res) => setRequests(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

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
        <div className="max-w-3xl mx-auto space-y-4">
          <Skeleton className="w-full h-32 rounded-2xl" />
          <Skeleton className="w-full h-32 rounded-2xl" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Team Applications"
      description="Review candidate applications and accept collaborators into your project roster"
      actions={
        <Link
          to={`/projects/${id}`}
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Project</span>
        </Link>
      }
    >
      <div className="max-w-3xl mx-auto overflow-x-hidden">
        {requests.length === 0 ? (
          <EmptyState
            icon={MailCheck}
            title="No applications pending"
            description="When student peers submit requests to join this project, their profiles and messages will appear here for review."
          />
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const applicantName = request.profiles?.full_name || 'Applicant';
              const avatarUrl = request.profiles?.avatar_url;

              return (
                <div
                  key={request.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <div className="w-11 h-11 rounded-xl bg-slate-900 text-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs text-xs font-bold">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={applicantName}
                            className="w-11 h-11 object-cover"
                          />
                        ) : (
                          <span>{getInitials(applicantName)}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <Link
                            to={`/profile/${request.profiles?.id}`}
                            className="text-sm font-bold text-slate-900 hover:text-emerald-700 transition-colors truncate"
                          >
                            {applicantName}
                          </Link>
                          <Badge color={statusColors[request.status] || 'gray'} size="xs" dot>
                            {statusLabels[request.status] || request.status}
                          </Badge>
                        </div>

                        {request.profiles?.college && (
                          <p className="text-xs text-slate-400 font-normal truncate flex items-center gap-1">
                            <GraduationCap className="w-3 h-3 text-slate-400" />
                            <span>{request.profiles.college}</span>
                            {request.profiles.experience_level && ` • ${request.profiles.experience_level} level`}
                          </p>
                        )}

                        {/* Intro Message */}
                        {request.message && (
                          <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              Applicant note:
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
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="flex-1 sm:flex-initial text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                          onClick={() => handleRespond(request.id, 'reject')}
                          loading={responding === request.id}
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
