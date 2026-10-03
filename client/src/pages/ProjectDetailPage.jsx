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

  const fetchProject = () => {
    api.get(`/projects/${id}`)
      .then((res) => setProject(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProject(); }, [id]);

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
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl font-bold text-text-primary">{project.title}</h1>
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

            <div className="flex items-center gap-2 shrink-0">
              {isOwner && (
                <>
                  <Link
                    to={`/projects/${id}/edit`}
                    className="p-2 rounded-lg hover:bg-surface-alt text-text-muted"
                    title="Edit project"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </Link>
                  <Link
                    to={`/projects/${id}/requests`}
                    className="p-2 rounded-lg hover:bg-surface-alt text-text-muted"
                    title="Manage requests"
                  >
                    <span className="material-symbols-outlined">mail</span>
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="p-2 rounded-lg hover:bg-red-50 text-text-muted hover:text-danger"
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
        <div className="bg-white rounded-xl border border-border p-6">
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
