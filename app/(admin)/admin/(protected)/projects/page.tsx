import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import ToggleStatusButton from '@/components/admin/ToggleStatusButton';

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 text-sm mt-1">
            {projects.length} total · {projects.filter(p => p.status === 'PUBLISHED').length} live
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Project
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {projects.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-slate-400 font-medium mb-1">No projects yet</p>
            <p className="text-slate-600 text-sm mb-4">Add your first project to get started</p>
            <Link href="/admin/projects/new" className="text-primary-400 hover:text-primary-300 text-sm transition-colors">
              Add your first project →
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left px-6 py-3.5 text-slate-400 font-medium text-xs uppercase tracking-wider">Title</th>
                <th className="text-left px-6 py-3.5 text-slate-400 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="text-left px-6 py-3.5 text-slate-400 font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Year</th>
                <th className="text-left px-6 py-3.5 text-slate-400 font-medium text-xs uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3.5 text-slate-400 font-medium text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-slate-800/60 hover:bg-slate-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {p.featured && (
                        <span className="text-accent-400" title="Featured">★</span>
                      )}
                      <div>
                        <p className="text-slate-200 font-medium">{p.title}</p>
                        <p className="text-slate-500 text-xs mt-0.5 truncate max-w-xs">{p.shortDescription}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-slate-400 text-sm">
                    {p.category?.name ?? <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell text-slate-400 text-sm">
                    {p.year ?? <span className="text-slate-600">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <ToggleStatusButton id={p.id} status={p.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/projects/${p.id}/edit`}
                      className="text-primary-400 hover:text-primary-300 transition-colors text-xs font-medium"
                    >
                      Edit →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
