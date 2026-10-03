export default function Spinner({ className = '', size = 'md' }) {
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-7 h-7 border-[2.5px]',
    lg: 'w-10 h-10 border-3',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeMap[size] || sizeMap.md} rounded-full border-slate-200 border-t-[#0f261f] animate-spin`}
      />
    </div>
  );
}
