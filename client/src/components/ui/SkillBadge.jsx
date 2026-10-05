import { Check, X } from 'lucide-react';

export default function SkillBadge({
  name,
  removable = false,
  onRemove,
  selected = false,
  onClick,
  size = 'sm',
}) {
  const sizeClasses =
    size === 'xs'
      ? 'px-2 py-0.5 text-[11px]'
      : 'px-2.5 py-1 text-xs';

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 font-medium rounded-lg border transition-all duration-150 cursor-pointer select-none ${sizeClasses}
          ${
            selected
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-semibold'
              : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
          }`}
      >
        <span>{name}</span>
        {selected && <Check className="w-3 h-3 text-emerald-400 stroke-[2.5]" />}
      </button>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-lg bg-slate-50/80 text-slate-700 border border-slate-200/80 ${sizeClasses}`}
    >
      <span>{name}</span>
      {removable && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:text-red-600 hover:bg-red-50 p-0.5 rounded ml-0.5 flex items-center justify-center cursor-pointer transition-colors"
          aria-label={`Remove ${name}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
