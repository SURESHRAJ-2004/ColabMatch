import { Inbox } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No items found',
  description = '',
  children,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-slate-200/90 bg-white/70 backdrop-blur-xs shadow-xs ${className}`}
    >
      <div className="w-12 h-12 rounded-xl bg-slate-100/90 border border-slate-200/80 flex items-center justify-center text-slate-500 mb-4 shadow-2xs">
        {typeof Icon === 'string' ? (
          <span className="material-symbols-outlined text-2xl text-slate-600">{Icon}</span>
        ) : (
          <Icon className="w-6 h-6 text-slate-600" />
        )}
      </div>
      <h3 className="text-base font-semibold text-slate-900 tracking-tight mb-1">
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
