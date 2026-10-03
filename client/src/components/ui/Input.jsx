export default function Input({
  label,
  id,
  type = 'text',
  error,
  icon,
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-700 tracking-tight">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-lg pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          className={`w-full py-2.5 rounded-xl border text-sm transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-[#0f261f]/10 focus:border-[#0f261f]
            ${icon ? 'pl-10 pr-3.5' : 'px-3.5'}
            ${error ? 'border-red-400 bg-red-50/20' : 'border-slate-200/90 bg-white hover:border-slate-300'}
            text-text-primary placeholder:text-slate-400 shadow-[0_1px_2px_rgba(0,0,0,0.02)]`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-medium mt-0.5">{error}</p>}
    </div>
  );
}

export function Textarea({
  label,
  id,
  error,
  rows = 3,
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-700 tracking-tight">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all duration-150 resize-vertical
          focus:outline-none focus:ring-2 focus:ring-[#0f261f]/10 focus:border-[#0f261f]
          ${error ? 'border-red-400 bg-red-50/20' : 'border-slate-200/90 bg-white hover:border-slate-300'}
          text-text-primary placeholder:text-slate-400 shadow-[0_1px_2px_rgba(0,0,0,0.02)]`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 font-medium mt-0.5">{error}</p>}
    </div>
  );
}

export function Select({
  label,
  id,
  options = [],
  error,
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-700 tracking-tight">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={`w-full px-3.5 py-2.5 pr-10 rounded-xl border text-sm transition-all duration-150 appearance-none
            focus:outline-none focus:ring-2 focus:ring-[#0f261f]/10 focus:border-[#0f261f]
            ${error ? 'border-red-400 bg-red-50/20' : 'border-slate-200/90 bg-white hover:border-slate-300'}
            text-text-primary cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
          expand_more
        </span>
      </div>
      {error && <p className="text-xs text-red-500 font-medium mt-0.5">{error}</p>}
    </div>
  );
}
