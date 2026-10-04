const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 mt-auto py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-[#0f261f] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-sm">join_inner</span>
            </div>
            <span className="text-sm font-extrabold text-slate-900 tracking-tight">
              COLABMATCH
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium text-center sm:text-right">
            &copy; {currentYear} COLABMATCH. The final-year project collaboration platform.
          </p>
        </div>
      </div>
    </footer>
  );
}
