export default function EmptyState({
  icon = 'inbox',
  title = 'No items found',
  description = '',
  children,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-[28px] border border-dashed border-slate-200 bg-white shadow-2xs ${className}`}
    >
      <div className="w-13 h-13 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-500 mb-4 shadow-2xs">
        <span className="material-symbols-outlined text-2xl text-slate-600">{icon}</span>
      </div>
      <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-4 leading-relaxed font-normal">
          {description}
        </p>
      )}
      {children && <div className="mt-1">{children}</div>}
    </div>
  );
}
