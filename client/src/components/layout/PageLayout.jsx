import { useState } from 'react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

export default function PageLayout({ children, title, description, actions }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen h-[100dvh] bg-slate-50 text-slate-900 flex w-full overflow-hidden">
      {/* 1. Sidebar (Fixed Desktop Shell) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. Main Content Column (Independently scrollable) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overflow-x-hidden">
        <TopHeader
          onOpenSidebar={() => setSidebarOpen(true)}
          title={title}
          description={description}
          actions={actions}
        />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
