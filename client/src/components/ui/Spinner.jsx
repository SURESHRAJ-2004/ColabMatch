export default function Spinner({ className = '', size = 'md' }) {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-[2.5px]',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeMap[size] || sizeMap.md} rounded-full border-slate-200 border-t-slate-900 animate-spin`}
      />
    </div>
  );
}
