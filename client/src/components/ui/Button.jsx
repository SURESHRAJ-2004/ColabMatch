import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  onClick,
  icon: Icon,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.98] cursor-pointer shrink-0';

  const variants = {
    primary:
      'bg-slate-900 text-white hover:bg-slate-800 border border-slate-900 shadow-xs hover:shadow',
    secondary:
      'bg-white text-slate-800 border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 shadow-xs',
    accent:
      'bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-600 shadow-xs',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 border border-rose-600 shadow-xs',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent',
    success:
      'bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-600 shadow-xs',
    outline:
      'bg-transparent text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
    md: 'h-9.5 px-4 text-xs sm:text-sm rounded-xl gap-2',
    lg: 'h-11 sm:h-11.5 px-5 text-sm rounded-xl gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
}
