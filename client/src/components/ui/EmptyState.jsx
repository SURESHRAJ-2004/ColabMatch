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
      className={`flex flex-col items-center justify-center text-center p-6 sm:p-10 rounded-2xl border border-dashed border-slate-200 bg-white/80 shadow-xs ${className}`}
    >
      <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-500 mb-3.5 shadow-2xs">
        <Icon className="w-5 h-5 text-slate-600" />
      </div>
      <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight mb-1">
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
