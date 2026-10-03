export default function StatsOverview({ stats }) {
  const items = [
    {
      label: 'Created Projects',
      value: stats.totalProjects ?? 0,
      icon: 'folder_open',
      accentBg: 'bg-blue-50',
      accentText: 'text-blue-600',
      accentBorder: 'border-blue-100',
      description: 'Projects you are leading',
    },
    {
      label: 'Team Memberships',
      value: stats.totalMemberships ?? 0,
      icon: 'group',
      accentBg: 'bg-emerald-50',
      accentText: 'text-emerald-700',
      accentBorder: 'border-emerald-100',
      description: 'Active project teams',
    },
    {
      label: 'Pending Requests',
      value: stats.pendingRequests ?? 0,
      icon: 'notifications_active',
      accentBg: 'bg-orange-50',
      accentText: 'text-orange-600',
      accentBorder: 'border-orange-100',
      description: 'Awaiting team review',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-white rounded-[26px] border border-slate-200/80 p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {item.label}
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${item.accentBg} ${item.accentText} ${item.accentBorder} shadow-xs`}
            >
              <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
            </div>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {item.value}
            </p>
            <p className="text-xs text-slate-400 font-medium mt-1">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
