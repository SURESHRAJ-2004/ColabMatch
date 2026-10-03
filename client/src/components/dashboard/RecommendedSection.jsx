import ProjectCard from '../project/ProjectCard';
import EmptyState from '../ui/EmptyState';

export default function RecommendedSection({ projects }) {
  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        icon="auto_awesome"
        title="No smart recommendations yet"
        description="Add your tech skills and experience level in your profile to unlock personalized project matches."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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
