export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  onClick,
  ...props
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer shrink-0';

  const variants = {
    primary:
      'bg-[#0f261f] text-white hover:bg-[#18362c] focus:ring-[#0f261f]/30 shadow-xs hover:shadow-sm',
    secondary:
      'bg-white text-slate-800 border border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-300 shadow-xs',
    accent:
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-xs',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-xs',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-200',
    success:
      'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-xs',
    outline:
      'bg-transparent text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-300',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs rounded-xl gap-1.5',
    md: 'h-10 px-4 text-xs sm:text-sm rounded-xl gap-2',
    lg: 'h-11 sm:h-12 px-5 text-sm sm:text-base rounded-xl gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
      )}
      {children}
    </button>
  );
}
