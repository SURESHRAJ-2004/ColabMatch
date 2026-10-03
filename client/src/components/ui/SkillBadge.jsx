export default function SkillBadge({ name, removable = false, onRemove, selected = false, onClick }) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors
          ${selected
            ? 'bg-primary-600 text-white'
            : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
          }`}
      >
        {name}
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
      {name}
      {removable && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:text-primary-900 ml-0.5"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      )}
    </span>
  );
}
