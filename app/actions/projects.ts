'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export type ProjectFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function parseForm(formData: FormData) {
  const galleryRaw = (formData.get('galleryImages') as string) || '[]';
  return {
    title: (formData.get('title') as string)?.trim(),
    shortDescription: (formData.get('shortDescription') as string)?.trim(),
    description: (formData.get('description') as string)?.trim(),
    challenge: (formData.get('challenge') as string)?.trim() || null,
    solution: (formData.get('solution') as string)?.trim() || null,
    categoryIds: formData.getAll('categoryIds') as string[],
    tagIds: formData.getAll('tagIds') as string[],
    results: ((formData.get('results') as string)?.trim() || '')
      .split('\n').map(r => r.trim()).filter(Boolean),
    year: formData.get('year') ? parseInt(formData.get('year') as string) : null,
    location: (formData.get('location') as string)?.trim() || null,
    client: (formData.get('client') as string)?.trim() || null,
    coverImage: (formData.get('coverImage') as string)?.trim() || null,
    status: (formData.get('status') as 'DRAFT' | 'PUBLISHED') || 'DRAFT',
    featured: formData.get('featured') === 'true',
    galleryImages: JSON.parse(galleryRaw) as { url: string; alt: string; order: number }[],
  };
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base;
  let suffix = 1;
  while (true) {
    const existing = await prisma.project.findFirst({ where: { slug } });
    if (!existing || existing.id === excludeId) break;
    slug = `${base}-${suffix++}`;
  }
  return slug;
}

// ─── Create ───────────────────────────────────────────────────────────────────
export async function createProject(
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const f = parseForm(formData);

  if (!f.title) return { fieldErrors: { title: 'Title is required' } };
  if (!f.shortDescription) return { fieldErrors: { shortDescription: 'Short description is required' } };
  if (!f.description) return { fieldErrors: { description: 'Description is required' } };

  let projectId: string;
  let slug: string;

  try {
    slug = await uniqueSlug(slugify(f.title));

    const project = await prisma.project.create({
      data: {
        title: f.title, slug, shortDescription: f.shortDescription,
        description: f.description, challenge: f.challenge, solution: f.solution,
        results: f.results, year: f.year, location: f.location, client: f.client,
        coverImage: f.coverImage, status: f.status, featured: f.featured,
        categoryId: f.categoryIds[0] ?? null,
      },
    });
    projectId = project.id;

    if (f.tagIds.length) {
      await prisma.projectTag.createMany({
        data: f.tagIds.map(tagId => ({ projectId, tagId })),
      });
    }
    if (f.galleryImages.length) {
      await prisma.projectImage.createMany({
        data: f.galleryImages.map(img => ({ projectId, url: img.url, alt: img.alt || null, order: img.order })),
      });
    }
    if (f.categoryIds.length) {
      await prisma.projectCategory.createMany({
        data: f.categoryIds.map(categoryId => ({ projectId, categoryId })),
      });
    }

    revalidatePath('/admin/projects');
    revalidatePath('/projects');
  } catch (e: unknown) {
    console.error('createProject error:', e);
    return { error: e instanceof Error ? e.message : 'An unexpected error occurred' };
  }

  redirect(`/admin/projects/${projectId}/edit?created=1`);
}

// ─── Update ───────────────────────────────────────────────────────────────────
export async function updateProject(
  id: string,
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const f = parseForm(formData);

  if (!f.title) return { fieldErrors: { title: 'Title is required' } };
  if (!f.shortDescription) return { fieldErrors: { shortDescription: 'Short description is required' } };
  if (!f.description) return { fieldErrors: { description: 'Description is required' } };

  try {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) return { error: 'Project not found' };

    const slug = await uniqueSlug(slugify(f.title), id);

    await prisma.project.update({
      where: { id },
      data: {
        title: f.title, slug, shortDescription: f.shortDescription,
        description: f.description, challenge: f.challenge, solution: f.solution,
        results: f.results, year: f.year, location: f.location, client: f.client,
        coverImage: f.coverImage, status: f.status, featured: f.featured,
        categoryId: f.categoryIds[0] ?? null,
      },
    });

    await prisma.projectTag.deleteMany({ where: { projectId: id } });
    if (f.tagIds.length) {
      await prisma.projectTag.createMany({
        data: f.tagIds.map(tagId => ({ projectId: id, tagId })),
      });
    }

    await prisma.projectImage.deleteMany({ where: { projectId: id } });
    if (f.galleryImages.length) {
      await prisma.projectImage.createMany({
        data: f.galleryImages.map(img => ({ projectId: id, url: img.url, alt: img.alt || null, order: img.order })),
      });
    }

    await prisma.projectCategory.deleteMany({ where: { projectId: id } });
    if (f.categoryIds.length) {
      await prisma.projectCategory.createMany({
        data: f.categoryIds.map(categoryId => ({ projectId: id, categoryId })),
      });
    }

    revalidatePath('/admin/projects');
    revalidatePath(`/projects/${slug}`);
    revalidatePath('/projects');
  } catch (e: unknown) {
    console.error('updateProject error:', e);
    return { error: e instanceof Error ? e.message : 'An unexpected error occurred' };
  }

  return {};
}

// ─── Delete ───────────────────────────────────────────────────────────────────
export async function deleteProject(id: string): Promise<void> {
  await prisma.project.delete({ where: { id } });
  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  redirect('/admin/projects');
}

// ─── Toggle Status ─────────────────────────────────────────────────────────
export async function toggleProjectStatus(id: string, current: 'DRAFT' | 'PUBLISHED') {
  await prisma.project.update({
    where: { id },
    data: { status: current === 'DRAFT' ? 'PUBLISHED' : 'DRAFT' },
  });
  revalidatePath('/admin/projects');
}
