export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <span className={`material-symbols-outlined animate-spin text-primary-500 ${sizes[size]}`}>
        progress_activity
      </span>
    </div>
  );
}
