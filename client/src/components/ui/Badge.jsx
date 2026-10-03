const badgeColors = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200/60',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
  yellow: 'bg-amber-50 text-amber-700 border-amber-200/60',
  orange: 'bg-orange-50 text-orange-700 border-orange-200/60',
  red: 'bg-rose-50 text-rose-700 border-rose-200/60',
  purple: 'bg-purple-50 text-purple-700 border-purple-200/60',
  gray: 'bg-slate-100 text-slate-600 border-slate-200/60',
  dark: 'bg-[#0f261f] text-white border-transparent',
};

export default function Badge({ children, color = 'blue', className = '', size = 'sm' }) {
  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border ${badgeColors[color] || badgeColors.blue} ${sizeStyles[size] || sizeStyles.sm} ${className}`}
    >
      {children}
    </span>
  );
}
