export default function EmptyState({
  icon = 'inbox',
  title = 'No items found',
  description = '',
  children,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-[28px] border border-dashed border-slate-200/90 bg-white/70 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-100/90 border border-slate-200/60 flex items-center justify-center text-slate-500 mb-4 shadow-xs">
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <h3 className="text-base font-semibold text-text-primary tracking-tight mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-xs sm:text-sm text-text-secondary max-w-sm mb-5 leading-relaxed">
          {description}
        </p>
      )}
      {children && <div className="mt-1">{children}</div>}
    </div>
  );
}
