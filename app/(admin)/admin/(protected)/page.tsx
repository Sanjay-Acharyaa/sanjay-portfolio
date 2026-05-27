import { prisma } from '@/lib/prisma';
import Link from 'next/link';

async function getStats() {
  const [projects, published, messages, unread, categories] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: 'PUBLISHED' } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
    prisma.category.count(),
  ]);
  return { projects, published, messages, unread, categories };
}

async function getRecentMessages() {
  return prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });
}

async function getRecentProjects() {
  return prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { category: true },
  });
}

export default async function AdminDashboard() {
  const [stats, messages, projects] = await Promise.all([
    getStats(),
    getRecentMessages(),
    getRecentProjects(),
  ]);

  const statCards = [
    { label: 'Total Projects', value: stats.projects, sub: `${stats.published} published`, href: '/admin/projects', color: 'from-primary-500 to-primary-700' },
    { label: 'Categories', value: stats.categories, sub: 'Active categories', href: '/admin/categories', color: 'from-violet-500 to-violet-700' },
    { label: 'Messages', value: stats.messages, sub: `${stats.unread} unread`, href: '/admin/messages', color: 'from-accent-500 to-accent-700' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Welcome back, overview of your portfolio</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href}>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors group">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} mb-4 flex items-center justify-center`}>
                <span className="text-white text-xl font-bold">{card.value}</span>
              </div>
              <p className="text-white font-semibold">{card.label}</p>
              <p className="text-slate-500 text-sm mt-1">{card.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">Recent Projects</h2>
            <Link href="/admin/projects" className="text-primary-400 hover:text-primary-300 text-sm transition-colors">
              View all →
            </Link>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 text-sm">No projects yet</p>
              <Link href="/admin/projects/new" className="mt-3 inline-block text-primary-400 hover:text-primary-300 text-sm transition-colors">
                Add your first project →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-slate-800 last:border-0">
                  <div className="min-w-0">
                    <p className="text-slate-200 text-sm font-medium truncate">{p.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{p.category?.name ?? 'Uncategorised'}</p>
                  </div>
                  <span className={`shrink-0 ml-3 text-xs px-2 py-0.5 rounded-full font-medium ${
                    p.status === 'PUBLISHED'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-slate-700 text-slate-400'
                  }`}>
                    {p.status === 'PUBLISHED' ? 'Live' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold">Recent Messages</h2>
            <Link href="/admin/messages" className="text-primary-400 hover:text-primary-300 text-sm transition-colors">
              View all →
            </Link>
          </div>

          {messages.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {messages.map((m) => (
                <div key={m.id} className="flex items-start gap-3 py-2.5 border-b border-slate-800 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-slate-400 text-xs font-bold">
                    {m.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-slate-200 text-sm font-medium truncate">{m.name}</p>
                      {m.status === 'UNREAD' && (
                        <span className="shrink-0 w-2 h-2 rounded-full bg-accent-500" />
                      )}
                    </div>
                    <p className="text-slate-500 text-xs truncate mt-0.5">{m.subject}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/projects/new" className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-colors">
            + New Project
          </Link>
          <Link href="/admin/categories" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-700">
            Manage Categories
          </Link>
          <Link href="/admin/messages" className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-700">
            View Messages
          </Link>
        </div>
      </div>
    </div>
  );
}
