const badgeColors = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  yellow: 'bg-amber-50 text-amber-700 border-amber-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
  red: 'bg-rose-50 text-rose-700 border-rose-200',
  gray: 'bg-slate-100 text-slate-700 border-slate-200',
  dark: 'bg-slate-900 text-white border-slate-800',
};

const dotColors = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  emerald: 'bg-emerald-500',
  yellow: 'bg-amber-500',
  orange: 'bg-orange-500',
  red: 'bg-rose-500',
  gray: 'bg-slate-400',
  dark: 'bg-emerald-400',
};

export default function Badge({
  children,
  color = 'blue',
  className = '',
  size = 'sm',
  dot = false,
}) {
  const sizeStyles = {
    xs: 'px-2 py-0.5 text-[11px] font-medium',
    sm: 'px-2.5 py-0.5 text-xs font-medium',
    md: 'px-3 py-1 text-xs font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${badgeColors[color] || badgeColors.blue} ${sizeStyles[size] || sizeStyles.sm} ${className} shrink-0 whitespace-nowrap`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[color] || 'bg-slate-400'} shrink-0`}
        />
      )}
      <span>{children}</span>
    </span>
  );
}
