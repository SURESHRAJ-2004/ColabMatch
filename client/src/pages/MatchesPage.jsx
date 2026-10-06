import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PageLayout from '../components/layout/PageLayout';
import ProjectCard from '../components/project/ProjectCard';
import SkillBadge from '../components/ui/SkillBadge';
import { CardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Badge from '../components/ui/Badge';
import {
  FolderGit2,
  Users,
  Sparkles,
  Zap,
  Plus,
  Edit,
  GraduationCap,
  ChevronDown,
  Eye,
} from 'lucide-react';
import { getInitials } from '../utils/helpers';

export default function MatchesPage() {
  const [tab, setTab] = useState('projects'); // 'projects' | 'collaborators'
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Collaborator search state
  const [myProjects, setMyProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [recommendedCollaborators, setRecommendedCollaborators] = useState([]);
  const [loadingCollaborators, setLoadingCollaborators] = useState(false);

  // Fetch recommended projects for user
  useEffect(() => {
    api.get('/match/projects')
      .then((res) => setRecommendedProjects(res.data || []))
      .catch(console.error)
      .finally(() => setLoadingProjects(false));

    // Fetch user's owned projects to populate collaborator matching dropdown
    api.get('/dashboard')
      .then((res) => {
        const owned = res.data?.myProjects || [];
        setMyProjects(owned);
        if (owned.length > 0) {
          setSelectedProjectId(owned[0].id);
        }
      })
      .catch(console.error);
  }, []);

  // Fetch recommended collaborators when selectedProjectId changes
  useEffect(() => {
    if (!selectedProjectId) return;

    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) setLoadingCollaborators(true);
    }, 0);

    api.get(`/match/collaborators/${selectedProjectId}`)
      .then((res) => {
        if (isMounted) setRecommendedCollaborators(res.data || []);
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setRecommendedCollaborators([]);
      })
      .finally(() => {
        if (isMounted) setLoadingCollaborators(false);
      });

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [selectedProjectId]);

  return (
    <PageLayout
      title="Smart Matches"
      description="Discover projects and collaborators ranked by verified skill compatibility"
      actions={
        <div className="flex items-center rounded-xl bg-white border border-slate-200 p-1 shadow-xs shrink-0">
          <button
            type="button"
            onClick={() => setTab('projects')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap select-none ${
              tab === 'projects'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5 shrink-0" />
            <span><span className="hidden sm:inline">Matching </span>Projects</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('collaborators')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap select-none ${
              tab === 'collaborators'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span><span className="hidden sm:inline">Matching </span>Collaborators</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6 w-full overflow-x-hidden">
        {tab === 'projects' ? (
          /* Projects Matching Current User */
          <div>
            {loadingProjects ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : recommendedProjects.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                title="No project matches found"
                description="Add technical skills to your profile so our matching engine can calculate compatibility."
              >
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-1.5 h-9.5 px-4 mt-2 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-all shadow-xs"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Update Profile Skills</span>
                </Link>
              </EmptyState>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                {recommendedProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    matchScore={project.match_score}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Collaborators Matching User's Projects */
          <div>
            {myProjects.length === 0 ? (
              <EmptyState
                icon={FolderGit2}
                title="You haven't posted any projects yet"
                description="Create a project specifying required skills to find and invite matching peer teammates."
              >
                <Link
                  to="/projects/new"
                  className="inline-flex items-center gap-1.5 h-9.5 px-4 mt-2 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Project</span>
                </Link>
              </EmptyState>
            ) : (
              <div className="space-y-6 w-full">
                {/* Project selector dropdown */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="w-full md:w-auto">
                    <label
                      htmlFor="project-select"
                      className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5"
                    >
                      Filter By Your Project
                    </label>
                    <div className="relative">
                      <select
                        id="project-select"
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="w-full md:w-96 h-10 px-3.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 cursor-pointer appearance-none shadow-xs"
                      >
                        {myProjects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title} ({p.status})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 font-normal">
                    Ranking candidates based on required skills defined in this project
                  </div>
                </div>

                {loadingCollaborators ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[...Array(6)].map((_, i) => (
                      <CardSkeleton key={i} />
                    ))}
                  </div>
                ) : recommendedCollaborators.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    title="No matching collaborators yet"
                    description="No student developers currently match the skills required for this project. Check if your project has skills assigned."
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                    {recommendedCollaborators.map((candidate) => {
                      const candidateName = candidate.full_name || 'Candidate';
                      return (
                        <div
                          key={candidate.id}
                          className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-200 flex flex-col justify-between group"
                        >
                          <div>
                            {/* Header */}
                            <div className="flex items-start justify-between gap-3 mb-4">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-11 h-11 rounded-xl bg-slate-900 text-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs text-xs font-bold">
                                  {candidate.avatar_url ? (
                                    <img
                                      src={candidate.avatar_url}
                                      alt={candidateName}
                                      className="w-11 h-11 object-cover"
                                    />
                                  ) : (
                                    <span>{getInitials(candidateName)}</span>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                                    {candidateName}
                                  </h3>
                                  {candidate.college && (
                                    <p className="text-xs text-slate-400 font-normal truncate flex items-center gap-1">
                                      <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
                                      <span className="truncate">{candidate.college}</span>
                                    </p>
                                  )}
                                </div>
                              </div>

                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold tabular-nums border shrink-0 ${
                                  candidate.match_score >= 75
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : candidate.match_score >= 50
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                              >
                                <Zap className="w-3 h-3 fill-current" />
                                <span>{candidate.match_score}%</span>
                              </span>
                            </div>

                            {candidate.experience_level && (
                              <div className="text-xs text-slate-400 font-normal mb-3 flex items-center gap-1.5 capitalize">
                                <Badge color="gray" size="xs" dot>
                                  {candidate.experience_level} level
                                </Badge>
                              </div>
                            )}

                            {candidate.matching_skills && candidate.matching_skills.length > 0 && (
                              <div className="mb-4">
                                <p className="text-xs font-semibold text-slate-500 mb-1.5">
                                  Overlapping Skills:
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {candidate.matching_skills.map((skill) => (
                                    <SkillBadge key={skill.id} name={skill.name} size="xs" />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="pt-3.5 border-t border-slate-100 mt-auto">
                            <Link
                              to={`/profile/${candidate.id}`}
                              className="w-full h-9 inline-flex items-center justify-center gap-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 text-xs font-semibold transition-all shadow-xs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View Candidate Profile</span>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
