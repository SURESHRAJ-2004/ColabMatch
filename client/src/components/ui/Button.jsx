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
    'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer';

  const variants = {
    // Deep dark-green/black accent for primary active elements
    primary:
      'bg-[#0f261f] text-white hover:bg-[#18362c] focus:ring-[#0f261f]/40 shadow-[0_1px_2px_rgba(0,0,0,0.06)]',
    secondary:
      'bg-white text-text-primary border border-border hover:bg-surface-hover hover:border-slate-300 focus:ring-slate-300 shadow-[0_1px_2px_rgba(0,0,0,0.03)]',
    accent:
      'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-xs',
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-xs',
    ghost:
      'text-text-secondary hover:text-text-primary hover:bg-black/[0.04] focus:ring-slate-200',
    success:
      'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 shadow-xs',
    outline:
      'bg-transparent text-text-primary border border-border hover:bg-surface-hover focus:ring-slate-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2 text-sm rounded-xl gap-2',
    lg: 'px-[22px] py-2.5 text-sm sm:text-base rounded-xl gap-2.5',
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
