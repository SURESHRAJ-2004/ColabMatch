import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PageLayout from '../components/layout/PageLayout';
import ProjectCard from '../components/project/ProjectCard';
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
    <PageLayout
      title="Smart Matches"
      description="Discover projects and collaborators ranked by skill compatibility"
      actions={
        <div className="flex items-center rounded-xl bg-white border border-slate-200/90 p-1 shadow-2xs shrink-0">
          <button
            type="button"
            onClick={() => setTab('projects')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap select-none ${
              tab === 'projects'
                ? 'bg-[#0f261f] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">folder_special</span>
            <span>Projects</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('collaborators')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap select-none ${
              tab === 'collaborators'
                ? 'bg-[#0f261f] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">group_add</span>
            <span>Collaborators</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6 overflow-x-hidden">
        {tab === 'projects' ? (
          /* Projects Matching Current User */
          <div>
            {loadingProjects ? (
              <Spinner className="py-24" />
            ) : recommendedProjects.length === 0 ? (
              <EmptyState
                icon="sentiment_dissatisfied"
                title="No matched projects found"
                description="Make sure you have added technical skills to your profile so our matching engine can calculate compatibility."
              >
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-1.5 h-10 px-4 mt-2 rounded-xl bg-[#0f261f] text-white text-xs sm:text-sm font-bold hover:bg-[#18362c] transition-all shadow-xs"
                >
                  <span className="material-symbols-outlined text-base">edit</span>
                  Update Profile Skills
                </Link>
              </EmptyState>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                icon="create_new_folder"
                title="You don't have any projects yet"
                description="Create a project specifying required skills to find and invite matching teammates."
              >
                <Link
                  to="/projects/new"
                  className="inline-flex items-center gap-1.5 h-10 px-4 mt-2 rounded-xl bg-[#0f261f] text-white text-xs sm:text-sm font-bold hover:bg-[#18362c] transition-all shadow-xs"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  Create Project
                </Link>
              </EmptyState>
            ) : (
              <div className="space-y-6">
                {/* Project selector card */}
                <div className="bg-white rounded-[26px] border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="w-full md:w-auto">
                    <label
                      htmlFor="project-select"
                      className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5"
                    >
                      Select Your Project
                    </label>
                    <div className="relative">
                      <select
                        id="project-select"
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="w-full md:w-96 h-10.5 px-3.5 pr-10 bg-slate-50 border border-slate-200/90 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f261f]/15 focus:border-[#0f261f] cursor-pointer appearance-none shadow-xs"
                      >
                        {myProjects.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title} ({p.status})
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
                        expand_more
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Ranking candidate peers based on required skills in this project
                  </div>
                </div>

                {loadingCollaborators ? (
                  <Spinner className="py-24" />
                ) : recommendedCollaborators.length === 0 ? (
                  <EmptyState
                    icon="person_search"
                    title="No matching collaborators yet"
                    description="No student developers currently match the required skills for this project. Check if your project has skills assigned."
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {recommendedCollaborators.map((candidate) => (
                      <div
                        key={candidate.id}
                        className="bg-white rounded-[26px] border border-slate-200/80 p-5 sm:p-6 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
                      >
                        <div>
                          {/* Header */}
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                                {candidate.avatar_url ? (
                                  <img
                                    src={candidate.avatar_url}
                                    alt={candidate.full_name}
                                    className="w-11 h-11 rounded-2xl object-cover"
                                  />
                                ) : (
                                  <span className="material-symbols-outlined text-slate-500 text-xl">
                                    person
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-bold text-slate-900 truncate">
                                  {candidate.full_name}
                                </h3>
                                {candidate.college && (
                                  <p className="text-xs text-slate-400 font-medium truncate">
                                    {candidate.college}
                                  </p>
                                )}
                              </div>
                            </div>

                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border shrink-0 ${
                                candidate.match_score >= 75
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                                  : candidate.match_score >= 50
                                  ? 'bg-blue-50 text-blue-700 border-blue-200/70'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[13px]">bolt</span>
                              {candidate.match_score}%
                            </span>
                          </div>

                          {candidate.experience_level && (
                            <div className="text-xs text-slate-400 font-medium mb-3 flex items-center gap-1.5 capitalize">
                              <span className="material-symbols-outlined text-sm text-slate-400">
                                verified
                              </span>
                              {candidate.experience_level} level
                            </div>
                          )}

                          {candidate.matching_skills && candidate.matching_skills.length > 0 && (
                            <div className="mb-4">
                              <p className="text-xs font-bold text-slate-500 mb-1.5">
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
                            className="w-full h-10 inline-flex items-center justify-center gap-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 text-xs font-bold transition-all shadow-2xs"
                          >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                            View Candidate Profile
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
      </div>
    </PageLayout>
  );
}
