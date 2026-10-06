import { Link } from 'react-router-dom';
import ProjectCard from '../project/ProjectCard';
import EmptyState from '../ui/EmptyState';
import { Sparkles, Edit } from 'lucide-react';

export default function RecommendedSection({ projects }) {
  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="No smart recommendations yet"
        description="Add your technical skills and experience level in your profile to unlock personalized project matches."
      >
        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 mt-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Add Profile Skills</span>
        </Link>
      </EmptyState>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          matchScore={project.match_score}
        />
      ))}
    </div>
  );
}
