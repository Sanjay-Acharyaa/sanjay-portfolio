'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { createProject, updateProject, type ProjectFormState } from '@/app/actions/projects';
import type { Category, Tag, Project, ProjectTag, ProjectImage, ProjectCategory } from '@prisma/client';
import { cn } from '@/lib/utils';
import ImageUpload from './ImageUpload';
import GalleryUpload, { type GalleryImage } from './GalleryUpload';

type ProjectWithTags = Project & {
  tags: (ProjectTag & { tag: Tag })[];
  images: ProjectImage[];
  categories: (ProjectCategory & { category: Category })[];
};

interface Props {
  categories: Category[];
  tags: Tag[];
  project?: ProjectWithTags;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
    >
      {pending && (
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {pending ? 'Saving…' : label}
    </button>
  );
}

export default function ProjectForm({ categories, tags, project }: Props) {
  const isEdit = !!project;

  const action = isEdit
    ? updateProject.bind(null, project.id)
    : createProject;

  const [state, formAction] = useActionState<ProjectFormState, FormData>(action, {});
  const [selectedCategory, setSelectedCategory] = useState<string>(
    project?.categoryId ?? ''
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    project?.tags.map(pt => pt.tagId) ?? []
  );
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [coverPreview, setCoverPreview] = useState(project?.coverImage ?? '');
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(
    project?.images
      ? [...project.images]
          .sort((a, b) => a.order - b.order)
          .map(img => ({ url: img.url, alt: img.alt ?? '', order: img.order }))
      : []
  );
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('created') === '1') setSuccessMsg('Project created successfully!');
    }
  }, []);

  useEffect(() => {
    if (state && !state.error && !state.fieldErrors && isEdit) {
      setSuccessMsg('Project saved!');
      const t = setTimeout(() => setSuccessMsg(''), 3000);
      return () => clearTimeout(t);
    }
  }, [state, isEdit]);

  function toggleTag(id: string) {
    setSelectedTags(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  }

  return (
    <form action={formAction} className="space-y-8">
      {/* Hidden fields */}
      <input type="hidden" name="categoryId" value={selectedCategory} />
      {selectedTags.map(id => (
        <input key={id} type="hidden" name="tagIds" value={id} />
      ))}
      <input type="hidden" name="featured" value={featured ? 'true' : 'false'} />
      <input type="hidden" name="galleryImages" value={JSON.stringify(galleryImages)} />

      {/* Global error */}
      {state?.error && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {state.error}
        </div>
      )}
      {successMsg && (
        <div className="px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
          {successMsg}
        </div>
      )}

      {/* ── Section: Basic Info ── */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Basic Info</h2>

        {/* Title */}
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-1.5">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            name="title"
            defaultValue={project?.title}
            placeholder="Metropolitan Highway Expansion"
            className={cn(
              'w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary-500 transition-colors',
              state?.fieldErrors?.title ? 'border-red-500' : 'border-slate-700'
            )}
          />
          {state?.fieldErrors?.title && (
            <p className="text-red-400 text-xs mt-1">{state.fieldErrors.title}</p>
          )}
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-1.5">
            Short Description <span className="text-red-400">*</span>
          </label>
          <input
            name="shortDescription"
            defaultValue={project?.shortDescription}
            placeholder="One line summary shown on project cards"
            className={cn(
              'w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary-500 transition-colors',
              state?.fieldErrors?.shortDescription ? 'border-red-500' : 'border-slate-700'
            )}
          />
          {state?.fieldErrors?.shortDescription && (
            <p className="text-red-400 text-xs mt-1">{state.fieldErrors.shortDescription}</p>
          )}
        </div>

        {/* Category single-select */}
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-2">Category</label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('')}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                selectedCategory === ''
                  ? 'bg-slate-600 text-white border-slate-500'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
              )}
            >
              None
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                  selectedCategory === cat.id
                    ? 'text-white border-transparent'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                )}
                style={selectedCategory === cat.id ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
              >
                {selectedCategory === cat.id ? '✓ ' : ''}{cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="max-w-xs">
          <label className="block text-slate-400 text-sm font-medium mb-1.5">Status</label>
          <select
            name="status"
            defaultValue={project?.status ?? 'DRAFT'}
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>

        {/* Year + Location + Client */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1.5">Year</label>
            <input
              name="year"
              type="number"
              min="1990"
              max="2100"
              defaultValue={project?.year ?? ''}
              placeholder="2024"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1.5">Location</label>
            <input
              name="location"
              defaultValue={project?.location ?? ''}
              placeholder="Kathmandu, Nepal"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-slate-400 text-sm font-medium mb-1.5">Client</label>
            <input
              name="client"
              defaultValue={project?.client ?? ''}
              placeholder="Department of Roads"
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
        </div>

        {/* Featured toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFeatured(f => !f)}
            className={cn(
              'relative w-11 h-6 rounded-full transition-colors duration-200',
              featured ? 'bg-primary-600' : 'bg-slate-700'
            )}
          >
            <span className={cn(
              'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
              featured ? 'translate-x-5' : 'translate-x-0'
            )} />
          </button>
          <label className="text-slate-300 text-sm cursor-pointer" onClick={() => setFeatured(f => !f)}>
            Featured project <span className="text-slate-500">(shown on home page)</span>
          </label>
        </div>
      </section>

      {/* ── Section: Cover Image ── */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Cover Image</h2>
        <input type="hidden" name="coverImage" value={coverPreview} />
        <ImageUpload value={coverPreview} onChange={setCoverPreview} />
      </section>

      {/* ── Section: Image Gallery ── */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div>
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Image Gallery</h2>
          <p className="text-slate-500 text-xs mt-1">Additional project images shown on the detail page</p>
        </div>
        <GalleryUpload images={galleryImages} onChange={setGalleryImages} />
      </section>

      {/* ── Section: Tags ── */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Tags</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                selectedTags.includes(tag.id)
                  ? 'bg-primary-600/20 text-primary-400 border-primary-600/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
              )}
            >
              {selectedTags.includes(tag.id) ? '✓ ' : ''}{tag.name}
            </button>
          ))}
        </div>
        {selectedTags.length > 0 && (
          <p className="text-slate-500 text-xs">{selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected</p>
        )}
      </section>

      {/* ── Section: Content ── */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Content</h2>

        {/* Full Description */}
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-1.5">
            Full Description <span className="text-red-400">*</span>
          </label>
          <textarea
            name="description"
            defaultValue={project?.description}
            rows={5}
            placeholder="Detailed description of the project..."
            className={cn(
              'w-full px-4 py-2.5 bg-slate-800 border rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary-500 transition-colors resize-none',
              state?.fieldErrors?.description ? 'border-red-500' : 'border-slate-700'
            )}
          />
          {state?.fieldErrors?.description && (
            <p className="text-red-400 text-xs mt-1">{state.fieldErrors.description}</p>
          )}
        </div>

        {/* Challenge */}
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-1.5">Challenge</label>
          <textarea
            name="challenge"
            defaultValue={project?.challenge ?? ''}
            rows={3}
            placeholder="What were the main engineering challenges?"
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary-500 transition-colors resize-none"
          />
        </div>

        {/* Solution */}
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-1.5">Solution</label>
          <textarea
            name="solution"
            defaultValue={project?.solution ?? ''}
            rows={3}
            placeholder="How were the challenges addressed?"
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary-500 transition-colors resize-none"
          />
        </div>

        {/* Results */}
        <div>
          <label className="block text-slate-400 text-sm font-medium mb-1.5">
            Results <span className="text-slate-600 font-normal">(one per line)</span>
          </label>
          <textarea
            name="results"
            defaultValue={project?.results?.join('\n') ?? ''}
            rows={4}
            placeholder={"40% reduction in peak hour congestion\nCompleted 6 months ahead of schedule\nZero safety incidents"}
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:border-primary-500 transition-colors resize-none font-mono"
          />
          <p className="text-slate-600 text-xs mt-1">Each line becomes a bullet point on the project page</p>
        </div>
      </section>

      {/* ── Submit ── */}
      <div className="flex items-center gap-4">
        <SubmitButton label={isEdit ? 'Save Changes' : 'Create Project'} />
        <a
          href="/admin/projects"
          className="text-slate-400 hover:text-slate-200 text-sm transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
