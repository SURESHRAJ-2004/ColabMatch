const badgeColors = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  yellow: 'bg-amber-50 text-amber-700 border-amber-200/80',
  orange: 'bg-orange-50 text-orange-700 border-orange-200/80',
  red: 'bg-rose-50 text-rose-700 border-rose-200/80',
  purple: 'bg-purple-50 text-purple-700 border-purple-200/80',
  gray: 'bg-slate-100 text-slate-600 border-slate-200/80',
  dark: 'bg-[#0f261f] text-white border-transparent shadow-2xs',
};

export default function Badge({ children, color = 'blue', className = '', size = 'sm' }) {
  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[10px] font-semibold',
    sm: 'px-2.5 py-0.5 text-xs font-semibold',
    md: 'px-3 py-1 text-xs font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${badgeColors[color] || badgeColors.blue} ${sizeStyles[size] || sizeStyles.sm} ${className}`}
    >
      {children}
    </span>
  );
}
