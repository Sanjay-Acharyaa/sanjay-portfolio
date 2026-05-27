import { prisma } from '@/lib/prisma';
import ProjectForm from '@/components/admin/ProjectForm';
import Link from 'next/link';

export default async function NewProjectPage() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.tag.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/projects" className="text-slate-500 hover:text-slate-300 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">New Project</h1>
          <p className="text-slate-400 text-sm mt-0.5">Add a new project to your portfolio</p>
        </div>
      </div>

      <ProjectForm categories={categories} tags={tags} />
    </div>
  );
}
