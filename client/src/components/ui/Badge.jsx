const badgeColors = {
  blue: 'bg-primary-50 text-primary-700',
  green: 'bg-green-50 text-green-700',
  yellow: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-700',
  gray: 'bg-gray-100 text-gray-700',
};

export default function Badge({ children, color = 'blue', className = '' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColors[color]} ${className}`}>
      {children}
    </span>
  );
}
