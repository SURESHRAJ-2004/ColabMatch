import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PageLayout from '../components/layout/PageLayout';
import ProjectCard from '../components/project/ProjectCard';
import Badge from '../components/ui/Badge';
import SkillBadge from '../components/ui/SkillBadge';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';

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
    if (!selectedProjectId) {
      setRecommendedCollaborators([]);
      return;
    }

    setLoadingCollaborators(true);
    api.get(`/match/collaborators/${selectedProjectId}`)
      .then((res) => setRecommendedCollaborators(res.data || []))
      .catch(console.error)
      .finally(() => setLoadingCollaborators(false));
  }, [selectedProjectId]);

  return (
    <PageLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-600">auto_awesome</span>
            Smart Matches
          </h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Discover projects and teammates ranked by skill compatibility
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex w-full sm:w-auto rounded-lg bg-white border border-border p-1 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => setTab('projects')}
            className={`flex-1 sm:flex-initial justify-center flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              tab === 'projects'
                ? 'bg-primary-600 text-white shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-base">folder_special</span>
            Projects for Me
          </button>
          <button
            type="button"
            onClick={() => setTab('collaborators')}
            className={`flex-1 sm:flex-initial justify-center flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
              tab === 'collaborators'
                ? 'bg-primary-600 text-white shadow-xs'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-base">group_add</span>
            Find Collaborators
          </button>
        </div>
      </div>

      {tab === 'projects' ? (
        /* Projects Matching Current User */
        <div>
          {loadingProjects ? (
            <Spinner className="py-20" />
          ) : recommendedProjects.length === 0 ? (
            <EmptyState
              icon="sentiment_dissatisfied"
              title="No matched projects found"
              description="Make sure you have added skills to your profile so our matching algorithm can recommend relevant projects."
            >
              <Link
                to="/profile"
                className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-base">edit</span>
                Update Profile Skills
              </Link>
            </EmptyState>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {recommendedProjects.map((project) => (
                <div key={project.id} className="relative flex flex-col h-full">
                  <ProjectCard project={project} matchScore={project.match_score} />
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Collaborators Matching User's Projects */
        <div>
          {myProjects.length === 0 ? (
            <EmptyState
              icon="create_new_folder"
              title="You don't have any projects yet"
              description="Create a project with required skills to find compatible collaborators."
            >
              <Link
                to="/projects/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-base">add</span>
                Create Project
              </Link>
            </EmptyState>
          ) : (
            <div>
              {/* Project selector */}
              <div className="bg-white rounded-xl border border-border p-4 sm:p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="w-full md:w-auto">
                  <label htmlFor="project-select" className="text-xs font-semibold text-text-secondary uppercase tracking-wider block mb-1.5">
                    Select Your Project
                  </label>
                  <select
                    id="project-select"
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full md:w-80 px-3 py-2 bg-surface-alt border border-border rounded-lg text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                  >
                    {myProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.status})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-xs text-text-secondary">
                  Showing peers ranked by skills required for this project
                </div>
              </div>

              {loadingCollaborators ? (
                <Spinner className="py-20" />
              ) : recommendedCollaborators.length === 0 ? (
                <EmptyState
                  icon="person_search"
                  title="No matching collaborators yet"
                  description="We couldn't find other candidates with overlapping skills for this project. Ensure your project has required skills configured."
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {recommendedCollaborators.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="bg-white rounded-xl border border-border p-4 sm:p-5 flex flex-col justify-between hover:shadow-xs transition-shadow h-full"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2.5 mb-3">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                              {candidate.avatar_url ? (
                                <img
                                  src={candidate.avatar_url}
                                  alt={candidate.full_name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <span className="material-symbols-outlined text-primary-600">person</span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-semibold text-text-primary truncate">
                                {candidate.full_name}
                              </h3>
                              {candidate.college && (
                                <p className="text-xs text-text-secondary truncate">
                                  {candidate.college}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge color={candidate.match_score >= 75 ? 'green' : candidate.match_score >= 50 ? 'blue' : 'gray'} className="shrink-0">
                            {candidate.match_score}% Match
                          </Badge>
                        </div>

                        {candidate.experience_level && (
                          <div className="text-xs text-text-muted mb-3 flex items-center gap-1 capitalize">
                            <span className="material-symbols-outlined text-sm">workspace_premium</span>
                            {candidate.experience_level}
                          </div>
                        )}

                        {candidate.matching_skills && candidate.matching_skills.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-medium text-text-secondary mb-1">
                              Matching skills:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {candidate.matching_skills.map((skill) => (
                                <SkillBadge key={skill.id} name={skill.name} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-border mt-2">
                        <Link
                          to={`/profile/${candidate.id}`}
                          className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-surface-alt hover:bg-primary-50 text-text-primary hover:text-primary-700 text-xs font-medium transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          View Profile
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
}
