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
      toast.success('Join request sent!');
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
    if (!window.confirm('Remove this member?')) return;
    try {
      await api.delete(`/projects/${id}/members/${profileId}`);
      toast.success('Member removed');
      fetchProject();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to remove member');
    }
  };

  if (loading) {
    return <PageLayout><Spinner className="py-20" /></PageLayout>;
  }

  if (!project) {
    return (
      <PageLayout>
        <p className="text-center text-text-secondary py-20">Project not found.</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl border border-border p-5 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary break-words">{project.title}</h1>
                <Badge color={statusColors[project.status]}>
                  {statusLabels[project.status]}
                </Badge>
              </div>
              <p className="text-sm text-text-secondary">
                by{' '}
                <Link
                  to={`/profile/${project.owner?.id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {project.owner?.full_name}
                </Link>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto flex-wrap">
              {isOwner && (
                <>
                  <Link
                    to={`/projects/${id}/edit`}
                    className="p-2 rounded-lg hover:bg-surface-alt text-text-muted transition-colors"
                    title="Edit project"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </Link>
                  <Link
                    to={`/projects/${id}/requests`}
                    className="p-2 rounded-lg hover:bg-surface-alt text-text-muted transition-colors"
                    title="Manage requests"
                  >
                    <span className="material-symbols-outlined">mail</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="p-2 rounded-lg hover:bg-red-50 text-text-muted hover:text-danger transition-colors cursor-pointer"
                    title="Delete project"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </>
              )}
              {!isOwner && !isMember && project.status === 'open' && (
                <Button onClick={() => setJoinModal(true)}>
                  <span className="material-symbols-outlined text-lg">person_add</span>
                  Request to Join
                </Button>
              )}
              {isMember && !isOwner && (
                <Badge color="green">Member</Badge>
              )}
            </div>
          </div>

          {/* Description */}
          {project.description && (
            <p className="text-sm text-text-secondary mb-4">{project.description}</p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-text-muted mb-4">
            {project.category && (
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-base">category</span>
                {project.category}
              </span>
            )}
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-base">group</span>
              Team size: {project.team_size}
            </span>
          </div>

          {/* Skills */}
          {project.skills && project.skills.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {project.skills.map((skill) => (
                  <SkillBadge key={skill.id} name={skill.name} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Members */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h2 className="text-base font-semibold text-text-primary mb-4">
            Team Members ({project.members?.length || 0})
          </h2>
          {project.members && project.members.length > 0 ? (
            <MemberList
              members={project.members}
              ownerId={project.owner_id}
              currentUserId={user?.id}
              onRemove={handleRemoveMember}
            />
          ) : (
            <p className="text-sm text-text-muted">No members yet.</p>
          )}
        </div>

        {/* Recommended Collaborators (for project owner) */}
        {isOwner && (
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-600">auto_awesome</span>
                <h2 className="text-base font-semibold text-text-primary">
                  Recommended Collaborators
                </h2>
              </div>
              <Link
                to="/matches"
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                Explore more matches
              </Link>
            </div>

            {loadingMatches ? (
              <Spinner className="py-6" size="sm" />
            ) : recommendedCollaborators.length === 0 ? (
              <p className="text-sm text-text-muted py-2">
                No matching student candidates found yet based on required skills.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recommendedCollaborators.slice(0, 4).map((candidate) => (
                  <div
                    key={candidate.id}
                    className="p-3 rounded-lg border border-border bg-surface-alt flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                            {candidate.avatar_url ? (
                              <img
                                src={candidate.avatar_url}
                                alt={candidate.full_name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <span className="material-symbols-outlined text-primary-600 text-sm">person</span>
                            )}
                          </div>
                          <div className="truncate">
                            <h4 className="text-xs font-semibold text-text-primary truncate">
                              {candidate.full_name}
                            </h4>
                            {candidate.college && (
                              <p className="text-[11px] text-text-muted truncate">
                                {candidate.college}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge color={candidate.match_score >= 75 ? 'green' : candidate.match_score >= 50 ? 'blue' : 'gray'}>
                          {candidate.match_score}%
                        </Badge>
                      </div>

                      {candidate.matching_skills && candidate.matching_skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {candidate.matching_skills.slice(0, 3).map((s) => (
                            <span key={s.id} className="text-[10px] bg-white border border-border px-1.5 py-0.5 rounded text-text-secondary">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/profile/${candidate.id}`}
                      className="mt-2 text-center text-xs text-primary-600 hover:text-primary-700 font-medium py-1 rounded bg-white border border-border hover:bg-primary-50 transition-colors"
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
      <Modal isOpen={joinModal} onClose={() => setJoinModal(false)} title="Request to Join">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary">
            Send a message to the project owner explaining why you'd like to join.
          </p>
          <Textarea
            id="join-message"
            placeholder="I'd like to join because..."
            value={joinMessage}
            onChange={(e) => setJoinMessage(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end gap-2">
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
