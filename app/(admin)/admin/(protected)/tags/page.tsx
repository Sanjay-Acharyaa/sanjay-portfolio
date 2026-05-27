import { prisma } from '@/lib/prisma';
import TagManager from '@/components/admin/TagManager';

export default async function AdminTagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { projects: true } } },
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Tags</h1>
        <p className="text-slate-400 text-sm mt-1">{tags.length} tags</p>
      </div>
      <TagManager tags={tags} />
    </div>
  );
}
