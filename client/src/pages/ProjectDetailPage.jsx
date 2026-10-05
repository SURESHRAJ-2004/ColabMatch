import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageLayout from '../components/layout/PageLayout';
import MemberList from '../components/project/MemberList';
import Badge from '../components/ui/Badge';
import SkillBadge from '../components/ui/SkillBadge';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import Modal from '../components/ui/Modal';
import { Textarea } from '../components/ui/Input';
import toast from 'react-hot-toast';
import {
  Edit3,
  Mail,
  Trash2,
  UserPlus,
  Users,
  Tag,
  Sparkles,
  Zap,
  ArrowLeft,
  ArrowRight,
  Send,
} from 'lucide-react';
import { getInitials } from '../utils/helpers';

const statusColors = { open: 'green', in_progress: 'blue', completed: 'gray' };
const statusLabels = { open: 'Recruiting', in_progress: 'In Progress', completed: 'Completed' };

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joinModal, setJoinModal] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');
  const [joining, setJoining] = useState(false);
  const [recommendedCollaborators, setRecommendedCollaborators] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  const fetchProject = useCallback(() => {
    api.get(`/projects/${id}`)
      .then((res) => {
        setProject(res.data);
        if (res.data?.owner_id === user?.id) {
          setLoadingMatches(true);
          api.get(`/match/collaborators/${id}`)
            .then((mRes) => setRecommendedCollaborators(mRes.data || []))
            .catch(console.error)
            .finally(() => setLoadingMatches(false));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, user?.id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const isOwner = project?.owner_id === user?.id;
  const isMember = project?.members?.some((m) => (m.profile_id || m.profiles?.id) === user?.id);

  const handleJoin = async () => {
    setJoining(true);
    try {
      await api.post(`/projects/${id}/join`, { message: joinMessage });
      toast.success('Join request sent successfully!');
      setJoinModal(false);
      setJoinMessage('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send request');
    } finally {
      setJoining(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      navigate('/projects');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete project');
    }
  };

  const handleRemoveMember = async (profileId) => {
    if (!window.confirm('Remove this member from team?')) return;
    try {
      await api.delete(`/projects/${id}/members/${profileId}`);
      toast.success('Member removed');
      fetchProject();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to remove member');
    }
  };

  if (loading) {
    return (
      <PageLayout title="Project Details" description="Loading project...">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="w-full h-56 rounded-2xl" />
          <Skeleton className="w-full h-48 rounded-2xl" />
        </div>
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout title="Project Not Found" description="The requested project was not found">
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 p-8 max-w-xl mx-auto">
          <p className="text-slate-500 text-sm mb-4">Project not found or was removed.</p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Projects
          </Link>
        </div>
      </PageLayout>
    );
  }

  const currentMembersCount = project.members?.length || 1;
  const targetSeats = project.team_size || 4;
  const occupancyPercentage = Math.min(100, Math.round((currentMembersCount / targetSeats) * 100));

  return (
    <PageLayout
      title={project.title}
      description={`Led by ${project.owner?.full_name || 'Project Lead'}`}
      actions={
        <div className="flex items-center gap-2">
          {isOwner && (
            <>
              <Link
                to={`/projects/${id}/edit`}
                className="h-9 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-xs inline-flex items-center gap-1.5 text-xs font-semibold"
                title="Edit Project"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit</span>
              </Link>
              <Link
                to={`/projects/${id}/requests`}
                className="h-9 px-2.5 sm:px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors shadow-xs inline-flex items-center gap-1.5"
                title="Manage Requests"
              >
                <Mail className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Requests</span>
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                className="h-9 px-2.5 sm:px-3 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1 text-xs font-semibold"
                title="Delete Project"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </>
          )}

          {!isOwner && !isMember && project.status === 'open' && (
            <Button onClick={() => setJoinModal(true)} size="sm" className="h-9">
              <UserPlus className="w-3.5 h-3.5" />
              <span><span className="hidden sm:inline">Request to </span>Join</span>
            </Button>
          )}

          {isMember && !isOwner && (
            <Badge color="green" size="md" dot>Team Member</Badge>
          )}
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6 overflow-x-hidden">
        {/* Project Hero Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap mb-2.5">
                <Badge color={statusColors[project.status] || 'gray'} dot>
                  {statusLabels[project.status] || project.status}
                </Badge>
                {project.category && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    <Tag className="w-3 h-3 text-slate-400" />
                    {project.category}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 tabular-nums">
                  <Users className="w-3 h-3 text-slate-400" />
                  {currentMembersCount} / {targetSeats} Members
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug break-words">
                {project.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1.5">
                Initiative Lead:{' '}
                <Link
                  to={`/profile/${project.owner?.id}`}
                  className="text-slate-900 font-semibold hover:underline"
                >
                  {project.owner?.full_name}
                </Link>
                {project.owner?.college && ` • ${project.owner.college}`}
              </p>
            </div>
          </div>

          {/* Team Capacity Progress Bar */}
          <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-semibold text-slate-700 mb-2">
              <span>Team Roster Capacity</span>
              <span className="tabular-nums text-slate-500 font-normal text-[11px] sm:text-xs">{currentMembersCount} of {targetSeats} seats occupied ({occupancyPercentage}%)</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-900 rounded-full transition-all duration-300"
                style={{ width: `${occupancyPercentage}%` }}
              />
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Project Overview & Objectives
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                {project.description}
              </p>
            </div>
          )}

          {/* Required Skills */}
          {project.skills && project.skills.length > 0 && (
            <div className="pt-5 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Required Technical Stack & Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <SkillBadge key={skill.id} name={skill.name} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Team Members Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-500" />
                <span>Team Members ({project.members?.length || 0} / {targetSeats})</span>
              </h2>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Collaborators actively participating in this capstone
              </p>
            </div>
          </div>

          {project.members && project.members.length > 0 ? (
            <MemberList
              members={project.members}
              ownerId={project.owner_id}
              currentUserId={user?.id}
              onRemove={handleRemoveMember}
            />
          ) : (
            <p className="text-sm text-slate-400">No members have joined yet.</p>
          )}
        </div>

        {/* Recommended Collaborators (for project owner) */}
        {isOwner && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    Recommended Collaborators
                  </h2>
                  <p className="text-xs text-slate-400 font-normal">
                    Student candidates who possess skills required for this initiative
                  </p>
                </div>
              </div>
              <Link
                to="/matches"
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 self-start sm:self-auto shrink-0"
              >
                <span>All matches</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loadingMatches ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-28 rounded-xl" />
                <Skeleton className="h-28 rounded-xl" />
              </div>
            ) : recommendedCollaborators.length === 0 ? (
              <p className="text-xs sm:text-sm text-slate-400 py-3">
                No matching candidate profiles found yet. Add more required technical skills to your project to improve recommendations.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendedCollaborators.slice(0, 4).map((candidate) => {
                  const candidateName = candidate.full_name || 'Candidate';
                  return (
                    <div
                      key={candidate.id}
                      className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col justify-between shadow-2xs"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 overflow-hidden text-xs font-bold">
                              {candidate.avatar_url ? (
                                <img
                                  src={candidate.avatar_url}
                                  alt={candidateName}
                                  className="w-8 h-8 object-cover"
                                />
                              ) : (
                                <span>{getInitials(candidateName)}</span>
                              )}
                            </div>
                            <div className="truncate min-w-0 flex-1">
                              <h4 className="text-xs font-bold text-slate-900 truncate">
                                {candidateName}
                              </h4>
                              {candidate.college && (
                                <p className="text-[11px] text-slate-400 truncate">
                                  {candidate.college}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge
                            color={
                              candidate.match_score >= 75
                                ? 'green'
                                : candidate.match_score >= 50
                                ? 'blue'
                                : 'gray'
                            }
                            size="xs"
                            className="shrink-0"
                          >
                            <Zap className="w-3 h-3 fill-current" />
                            <span>{candidate.match_score}%</span>
                          </Badge>
                        </div>

                        {candidate.matching_skills && candidate.matching_skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {candidate.matching_skills.slice(0, 3).map((s) => (
                              <span
                                key={s.id}
                                className="text-[10px] font-medium bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-600"
                              >
                                {s.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <Link
                        to={`/profile/${candidate.id}`}
                        className="mt-3 text-center text-xs font-semibold text-slate-800 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-2xs block"
                      >
                        View Profile
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Join Request Modal */}
      <Modal isOpen={joinModal} onClose={() => setJoinModal(false)} title="Apply to Join Team">
        <div className="flex flex-col gap-4">
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
            Send an introduction message to <strong className="text-slate-800 font-semibold">{project.owner?.full_name}</strong>. Highlight your relevant skills and how you envision contributing.
          </p>
          <Textarea
            id="join-message"
            placeholder="Hi, I'm passionate about this initiative and have hands-on experience with the required tech stack..."
            value={joinMessage}
            onChange={(e) => setJoinMessage(e.target.value)}
            rows={4}
          />
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-2 border-t border-slate-100">
            <Button variant="secondary" onClick={() => setJoinModal(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleJoin} loading={joining} className="w-full sm:w-auto">
              <Send className="w-3.5 h-3.5" />
              <span>Send Request</span>
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
}
