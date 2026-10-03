export default function EmptyState({ icon = 'inbox', title, description, children }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="material-symbols-outlined text-5xl text-text-muted mb-3">{icon}</span>
      <h3 className="text-lg font-medium text-text-primary mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-text-secondary max-w-sm mb-4">{description}</p>
      )}
      {children}
    </div>
  );
}
