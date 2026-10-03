export default function SkillBadge({
  name,
  removable = false,
  onRemove,
  selected = false,
  onClick,
  size = 'sm',
}) {
  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-all duration-150 cursor-pointer ${sizeClasses}
          ${
            selected
              ? 'bg-[#0f261f] text-white border-[#0f261f] shadow-xs'
              : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
          }`}
      >
        <span>{name}</span>
        {selected && (
          <span className="material-symbols-outlined text-[13px]">check</span>
        )}
      </button>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full bg-slate-50 text-slate-700 border border-slate-200/70 ${sizeClasses}`}
    >
      <span>{name}</span>
      {removable && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:text-red-600 ml-0.5 flex items-center justify-center cursor-pointer transition-colors"
          aria-label={`Remove ${name}`}
        >
          <span className="material-symbols-outlined text-xs">close</span>
        </button>
      )}
    </span>
  );
}
