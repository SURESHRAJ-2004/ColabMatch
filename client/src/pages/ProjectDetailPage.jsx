import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageLayout from '../components/layout/PageLayout';
import MemberList from '../components/project/MemberList';
import Badge from '../components/ui/Badge';
import SkillBadge from '../components/ui/SkillBadge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import { Textarea } from '../components/ui/Input';
import toast from 'react-hot-toast';

const statusColors = { open: 'green', in_progress: 'blue', completed: 'gray' };
const statusLabels = { open: 'Open', in_progress: 'In Progress', completed: 'Completed' };

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

  const fetchProject = () => {
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
  };

  useEffect(() => { fetchProject(); }, [id, user?.id]);

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
        <Spinner className="py-24" />
      </PageLayout>
    );
  }

  if (!project) {
    return (
      <PageLayout title="Project Not Found" description="The requested project was not found">
        <p className="text-center text-slate-500 py-24">Project not found or was removed.</p>
      </PageLayout>
    );
  }

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
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-xs"
                title="Edit Project"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
              </Link>
              <Link
                to={`/projects/${id}/requests`}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition-colors shadow-xs"
                title="Manage Requests"
              >
                <span className="material-symbols-outlined text-base">mail</span>
                Requests
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                className="p-2 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 transition-colors cursor-pointer shadow-xs"
                title="Delete Project"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
              </button>
            </>
          )}

          {!isOwner && !isMember && project.status === 'open' && (
            <Button onClick={() => setJoinModal(true)}>
              <span className="material-symbols-outlined text-base">person_add</span>
              Request to Join
            </Button>
          )}

          {isMember && !isOwner && (
            <Badge color="green" size="md">Team Member</Badge>
          )}
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6 overflow-x-hidden">
        {/* Project Hero Card */}
        <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 sm:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap mb-2">
                <Badge color={statusColors[project.status] || 'gray'}>
                  {statusLabels[project.status] || project.status}
                </Badge>
                {project.category && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    <span className="material-symbols-outlined text-xs">category</span>
                    {project.category}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                  <span className="material-symbols-outlined text-xs">group</span>
                  {project.team_size || 4} Total Seats
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug break-words">
                {project.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                Project Lead:{' '}
                <Link
                  to={`/profile/${project.owner?.id}`}
                  className="text-slate-800 font-bold hover:underline"
                >
                  {project.owner?.full_name}
                </Link>
                {project.owner?.college && ` • ${project.owner.college}`}
              </p>
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <div className="mb-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                About this Project
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
                Required Technical Skills
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
        <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Team Members ({project.members?.length || 0} / {project.team_size || 4})
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Current collaborators on this initiative
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
          <div className="bg-white rounded-[28px] border border-slate-200/80 p-6 sm:p-7 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0f261f]">auto_awesome</span>
                <div>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    Recommended Collaborators
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    Candidates who possess the skills required for this project
                  </p>
                </div>
              </div>
              <Link
                to="/matches"
                className="text-xs font-bold text-[#0f261f] hover:underline flex items-center gap-1"
              >
                More matches
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            {loadingMatches ? (
              <Spinner className="py-8" size="sm" />
            ) : recommendedCollaborators.length === 0 ? (
              <p className="text-xs sm:text-sm text-slate-400 py-3">
                No matching candidate profiles found yet. Add more required skills to your project to improve match results.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendedCollaborators.slice(0, 4).map((candidate) => (
                  <div
                    key={candidate.id}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                            {candidate.avatar_url ? (
                              <img
                                src={candidate.avatar_url}
                                alt={candidate.full_name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <span className="material-symbols-outlined text-slate-500 text-sm">
                                person
                              </span>
                            )}
                          </div>
                          <div className="truncate">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {candidate.full_name}
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
                        >
                          {candidate.match_score}%
                        </Badge>
                      </div>

                      {candidate.matching_skills && candidate.matching_skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {candidate.matching_skills.slice(0, 3).map((s) => (
                            <span
                              key={s.id}
                              className="text-[10px] font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-600"
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/profile/${candidate.id}`}
                      className="mt-3 text-center text-xs font-bold text-[#0f261f] py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-xs"
                    >
                      View Profile
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Join Request Modal */}
      <Modal isOpen={joinModal} onClose={() => setJoinModal(false)} title="Request to Join Team">
        <div className="flex flex-col gap-4">
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
            Introduce yourself to the project lead and briefly mention your relevant technical background or how you'd like to contribute.
          </p>
          <Textarea
            id="join-message"
            placeholder="Hi, I'm passionate about this topic and experienced with the required tech stack..."
            value={joinMessage}
            onChange={(e) => setJoinMessage(e.target.value)}
            rows={4}
          />
          <div className="flex justify-end gap-2.5 pt-2">
            <Button variant="secondary" onClick={() => setJoinModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleJoin} loading={joining}>
              Send Request
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
}
