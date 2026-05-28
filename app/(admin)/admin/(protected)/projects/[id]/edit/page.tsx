import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProjectForm from '@/components/admin/ProjectForm';
import DeleteProjectButton from '@/components/admin/DeleteProjectButton';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;

  const [project, categories, tags] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: { tags: { include: { tag: true } }, images: { orderBy: { order: 'asc' } }, categories: { include: { category: true } } },
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.tag.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!project) notFound();

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Project</h1>
          <p className="text-slate-400 text-sm mt-1">{project.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors border border-slate-700"
          >
            ← Back
          </Link>
          <DeleteProjectButton id={project.id} title={project.title} />
        </div>
      </div>

      <ProjectForm project={project} categories={categories} tags={tags} />
    </div>
  );
}
