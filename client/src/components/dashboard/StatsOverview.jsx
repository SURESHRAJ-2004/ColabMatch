export default function StatsOverview({ stats }) {
  const items = [
    { label: 'My Projects', value: stats.totalProjects, icon: 'folder_open', color: 'text-primary-600 bg-primary-50' },
    { label: 'Memberships', value: stats.totalMemberships, icon: 'group', color: 'text-green-600 bg-green-50' },
    { label: 'Pending Requests', value: stats.pendingRequests, icon: 'notifications', color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item.label} className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
              <span className="material-symbols-outlined">{item.icon}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{item.value}</p>
              <p className="text-xs text-text-muted">{item.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
