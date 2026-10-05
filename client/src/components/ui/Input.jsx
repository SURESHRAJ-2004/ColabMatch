import { ChevronDown, AlertCircle } from 'lucide-react';

export default function Input({
  label,
  id,
  type = 'text',
  error,
  icon: Icon,
  className = '',
  rightElement,
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
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            {typeof Icon === 'string' ? (
              <span className="material-symbols-outlined text-lg">{Icon}</span>
            ) : (
              <Icon className="w-4 h-4" />
            )}
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`w-full h-10 rounded-xl border text-sm transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900
            ${Icon ? 'pl-10' : 'pl-3.5'}
            ${rightElement ? 'pr-10' : 'pr-3.5'}
            ${error ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200/90 bg-white hover:border-slate-300'}
            text-slate-900 placeholder:text-slate-400 shadow-xs`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 flex items-center">{rightElement}</div>
        )}
      </div>
      {error && (
        <p className="inline-flex items-center gap-1 text-xs text-rose-600 font-medium mt-0.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
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
          focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900
          ${error ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200/90 bg-white hover:border-slate-300'}
          text-slate-900 placeholder:text-slate-400 shadow-xs leading-relaxed`}
        {...props}
      />
      {error && (
        <p className="inline-flex items-center gap-1 text-xs text-rose-600 font-medium mt-0.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
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
      <div className="relative flex items-center">
        <select
          id={id}
          className={`w-full h-10 px-3.5 pr-10 rounded-xl border text-sm transition-all duration-150 appearance-none
            focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900
            ${error ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200/90 bg-white hover:border-slate-300'}
            text-slate-900 cursor-pointer shadow-xs`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3.5 pointer-events-none text-slate-400 w-4 h-4" />
      </div>
      {error && (
        <p className="inline-flex items-center gap-1 text-xs text-rose-600 font-medium mt-0.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
