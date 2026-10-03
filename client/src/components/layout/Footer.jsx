export default function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-600">handshake</span>
            <span className="text-sm font-semibold text-text-primary">COLABMATCH</span>
          </div>
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} COLABMATCH. Built for final-year projects.
          </p>
        </div>
      </div>
    </footer>
  );
}
