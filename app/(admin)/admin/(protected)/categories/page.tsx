import { prisma } from '@/lib/prisma';
import CategoryManager from '@/components/admin/CategoryManager';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { projects: true } } },
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <p className="text-slate-400 text-sm mt-1">{categories.length} categories</p>
      </div>
      <CategoryManager categories={categories} />
    </div>
  );
}
