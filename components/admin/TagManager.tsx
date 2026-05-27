'use client';

import { useState, useTransition } from 'react';
import { createTag, deleteTag } from '@/app/actions/tags';
import type { Tag } from '@prisma/client';

type TagWithCount = Tag & { _count: { projects: number } };

export default function TagManager({ tags: initial }: { tags: TagWithCount[] }) {
  const [tags, setTags] = useState(initial);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setError('');

    const fd = new FormData();
    fd.set('name', name.trim());

    startTransition(async () => {
      const res = await createTag(fd);
      if (res?.error) { setError(res.error); return; }
      setName('');
      window.location.reload();
    });
  }

  async function handleDelete(id: string, tagName: string) {
    if (!confirm(`Delete tag "${tagName}"?`)) return;
    startTransition(async () => {
      await deleteTag(id);
      setTags(prev => prev.filter(t => t.id !== id));
    });
  }

  return (
    <div className="space-y-6">
      {/* Add tag form */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h2 className="text-white font-semibold text-sm mb-4">Add New Tag</h2>
        <form onSubmit={handleCreate} className="flex gap-3">
          <input
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            placeholder="e.g. Seismic Design"
            className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
          />
          <button
            type="submit"
            disabled={isPending || !name.trim()}
            className="px-4 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {isPending ? 'Adding…' : 'Add Tag'}
          </button>
        </form>
        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
      </div>

      {/* Tags grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h2 className="text-white font-semibold text-sm mb-4">All Tags</h2>
        {tags.length === 0 ? (
          <p className="text-slate-500 text-sm">No tags yet</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <div
                key={tag.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-full group hover:border-slate-500 transition-colors"
              >
                <span className="text-slate-300 text-sm">{tag.name}</span>
                <span className="text-slate-600 text-xs">({tag._count.projects})</span>
                <button
                  onClick={() => handleDelete(tag.id, tag.name)}
                  disabled={isPending}
                  className="text-slate-600 hover:text-red-400 transition-colors ml-1 opacity-0 group-hover:opacity-100"
                  title="Delete tag"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
