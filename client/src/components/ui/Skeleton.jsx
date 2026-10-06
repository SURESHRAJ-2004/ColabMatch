export default function Skeleton({ className = '', variant = 'rectangular' }) {
  const variantClasses = {
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
    card: 'rounded-2xl',
    text: 'h-4 rounded-md',
  };

  return (
    <div
      className={`animate-pulse bg-slate-200/70 ${variantClasses[variant] || 'rounded-xl'} ${className}`}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <Skeleton className="w-20 h-5" />
          <Skeleton className="w-16 h-5" />
        </div>
        <Skeleton className="w-3/4 h-5 mb-2.5" />
        <Skeleton className="w-1/2 h-3.5 mb-4" />
        <Skeleton className="w-full h-10 mb-4" />
        <div className="flex gap-2">
          <Skeleton className="w-16 h-5 rounded-lg" />
          <Skeleton className="w-20 h-5 rounded-lg" />
          <Skeleton className="w-14 h-5 rounded-lg" />
        </div>
      </div>
      <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-16 h-4" />
      </div>
    </div>
  );
}
