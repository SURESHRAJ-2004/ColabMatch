import ProjectCard from '../project/ProjectCard';
import EmptyState from '../ui/EmptyState';

export default function RecommendedSection({ projects }) {
  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        icon="recommend"
        title="No recommendations yet"
        description="Add skills to your profile to get personalized project recommendations."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
