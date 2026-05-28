'use client';

import { useState, useTransition } from 'react';
import { createCategory, updateCategory, deleteCategory } from '@/app/actions/categories';
import type { Category } from '@prisma/client';

type CategoryWithCount = Category & { _count: { projects: number } };

const PRESET_COLORS = [
  '#0083cc', '#ea580c', '#0891b2', '#7c3aed',
  '#059669', '#dc2626', '#d97706', '#db2777',
];

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {PRESET_COLORS.map(c => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={`w-7 h-7 rounded-full transition-transform ${value === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-800' : 'hover:scale-110'}`}
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  );
}

function CategoryForm({ onSubmit, onCancel, defaultValues, selectedColor, onColorChange, isPending, formError }: {
  onSubmit: (fd: FormData) => void;
  onCancel: () => void;
  defaultValues?: CategoryWithCount;
  selectedColor: string;
  onColorChange: (c: string) => void;
  isPending: boolean;
  formError: string;
}) {
  return (
    <form action={onSubmit} className="space-y-4 p-5 bg-slate-800/60 border border-slate-700 rounded-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1.5">Name *</label>
          <input
            name="name"
            defaultValue={defaultValues?.name}
            required
            placeholder="e.g. Structural Engineering"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1.5">Description</label>
          <input
            name="description"
            defaultValue={defaultValues?.description ?? ''}
            placeholder="Short description"
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>
      </div>

      <div className="w-28">
        <label className="block text-slate-400 text-xs font-medium mb-1.5">
          Order <span className="text-slate-600 font-normal">(lower = first)</span>
        </label>
        <input
          name="order"
          type="number"
          defaultValue={(defaultValues as CategoryWithCount & { order?: number })?.order ?? 0}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
        />
      </div>

      <div>
        <label className="block text-slate-400 text-xs font-medium mb-2">Color</label>
        <ColorPicker value={selectedColor} onChange={onColorChange} />
      </div>

      {formError && <p className="text-red-400 text-xs">{formError}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {isPending ? 'Saving…' : defaultValues ? 'Save Changes' : 'Create Category'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

interface Props { categories: CategoryWithCount[] }

export default function CategoryManager({ categories: initial }: Props) {
  const [categories, setCategories] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [isPending, startTransition] = useTransition();

  function startEdit(cat: CategoryWithCount) {
    setEditingId(cat.id);
    setSelectedColor(cat.color);
    setFormError('');
  }

  function handleCancel() {
    setShowForm(false);
    setEditingId(null);
    setFormError('');
  }

  async function handleCreate(formData: FormData) {
    formData.set('color', selectedColor);
    setFormError('');
    startTransition(async () => {
      const res = await createCategory(formData);
      if (res?.error) { setFormError(res.error); return; }
      setShowForm(false);
      setSelectedColor(PRESET_COLORS[0]);
      window.location.reload();
    });
  }

  async function handleUpdate(id: string, formData: FormData) {
    formData.set('color', selectedColor);
    setFormError('');
    startTransition(async () => {
      const res = await updateCategory(id, formData);
      if (res?.error) { setFormError(res.error); return; }
      setEditingId(null);
      window.location.reload();
    });
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? Projects in this category will become uncategorised.`)) return;
    startTransition(async () => {
      await deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    });
  }

  return (
    <div className="space-y-4">
      {!showForm && (
        <button
          onClick={() => { setShowForm(true); setEditingId(null); setSelectedColor(PRESET_COLORS[0]); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Category
        </button>
      )}

      {showForm && (
        <CategoryForm
          onSubmit={handleCreate}
          onCancel={handleCancel}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
          isPending={isPending}
          formError={formError}
        />
      )}

      <div className="space-y-2">
        {categories.map(cat => (
          <div key={cat.id}>
            {editingId === cat.id ? (
              <CategoryForm
                defaultValues={cat}
                onSubmit={fd => handleUpdate(cat.id, fd)}
                onCancel={handleCancel}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                isPending={isPending}
                formError={formError}
              />
            ) : (
              <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-slate-200 font-medium text-sm">{cat.name}</p>
                      <span className="text-slate-600 text-xs">#{(cat as CategoryWithCount & { order?: number }).order ?? 0}</span>
                    </div>
                    {cat.description && <p className="text-slate-500 text-xs mt-0.5">{cat.description}</p>}
                    <p className="text-slate-600 text-xs mt-0.5">{cat._count.projects} project{cat._count.projects !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(cat)}
                    className="px-3 py-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    disabled={isPending}
                    className="px-3 py-1.5 text-slate-400 hover:text-red-400 bg-slate-800 hover:bg-red-500/10 text-xs rounded-lg transition-colors disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
