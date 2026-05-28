'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export type ProjectFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

// ─── Create ───────────────────────────────────────────────────────────────────
export async function createProject(
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const title = (formData.get('title') as string)?.trim();
  const shortDescription = (formData.get('shortDescription') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const challenge = (formData.get('challenge') as string)?.trim() || null;
  const solution = (formData.get('solution') as string)?.trim() || null;
  const categoryIds = formData.getAll('categoryIds') as string[];
  const tagIds = formData.getAll('tagIds') as string[];
  const resultsRaw = (formData.get('results') as string)?.trim();
  const results = resultsRaw
    ? resultsRaw.split('\n').map(r => r.trim()).filter(Boolean)
    : [];
  const year = formData.get('year') ? parseInt(formData.get('year') as string) : null;
  const location = (formData.get('location') as string)?.trim() || null;
  const client = (formData.get('client') as string)?.trim() || null;
  const coverImage = (formData.get('coverImage') as string)?.trim() || null;
  const status = (formData.get('status') as 'DRAFT' | 'PUBLISHED') || 'DRAFT';
  const featured = formData.get('featured') === 'true';
  const galleryRaw = (formData.get('galleryImages') as string) || '[]';
  const galleryImages: { url: string; alt: string; order: number }[] = JSON.parse(galleryRaw);

  if (!title) return { fieldErrors: { title: 'Title is required' } };
  if (!shortDescription) return { fieldErrors: { shortDescription: 'Short description is required' } };
  if (!description) return { fieldErrors: { description: 'Description is required' } };

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.project.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  // Create project with scalar fields only — no nested writes (PrismaNeonHttp has no transactions)
  const project = await prisma.project.create({
    data: {
      title, slug, shortDescription, description, challenge, solution,
      results, year, location, client, coverImage, status, featured,
      categoryId: categoryIds[0] ?? null,
    },
  });

  if (tagIds.length) {
    await prisma.projectTag.createMany({
      data: tagIds.map(tagId => ({ projectId: project.id, tagId })),
    });
  }
  if (galleryImages.length) {
    await prisma.projectImage.createMany({
      data: galleryImages.map(img => ({ projectId: project.id, url: img.url, alt: img.alt || null, order: img.order })),
    });
  }
  if (categoryIds.length) {
    await prisma.projectCategory.createMany({
      data: categoryIds.map(categoryId => ({ projectId: project.id, categoryId })),
    });
  }

  revalidatePath('/admin/projects');
  revalidatePath('/projects');
  redirect(`/admin/projects/${project.id}/edit?created=1`);
}

// ─── Update ───────────────────────────────────────────────────────────────────
export async function updateProject(
  id: string,
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const title = (formData.get('title') as string)?.trim();
  const shortDescription = (formData.get('shortDescription') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const challenge = (formData.get('challenge') as string)?.trim() || null;
  const solution = (formData.get('solution') as string)?.trim() || null;
  const categoryIds = formData.getAll('categoryIds') as string[];
  const tagIds = formData.getAll('tagIds') as string[];
  const resultsRaw = (formData.get('results') as string)?.trim();
  const results = resultsRaw
    ? resultsRaw.split('\n').map(r => r.trim()).filter(Boolean)
    : [];
  const year = formData.get('year') ? parseInt(formData.get('year') as string) : null;
  const location = (formData.get('location') as string)?.trim() || null;
  const client = (formData.get('client') as string)?.trim() || null;
  const coverImage = (formData.get('coverImage') as string)?.trim() || null;
  const status = (formData.get('status') as 'DRAFT' | 'PUBLISHED') || 'DRAFT';
  const featured = formData.get('featured') === 'true';
  const galleryRaw = (formData.get('galleryImages') as string) || '[]';
  const galleryImages: { url: string; alt: string; order: number }[] = JSON.parse(galleryRaw);

  if (!title) return { fieldErrors: { title: 'Title is required' } };
  if (!shortDescription) return { fieldErrors: { shortDescription: 'Short description is required' } };
  if (!description) return { fieldErrors: { description: 'Description is required' } };

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) return { error: 'Project not found' };

  let slug = existing.slug;
  if (slugify(title) !== slugify(existing.title)) {
    const baseSlug = slugify(title);
    slug = baseSlug;
    let suffix = 1;
    while (await prisma.project.findUnique({ where: { slug, NOT: { id } } })) {
      slug = `${baseSlug}-${suffix++}`;
    }
  }

  // Update scalar fields only — no nested writes (PrismaNeonHttp has no transactions)
  await prisma.project.update({
    where: { id },
    data: {
      title, slug, shortDescription, description, challenge, solution,
      results, year, location, client, coverImage, status, featured,
      categoryId: categoryIds[0] ?? null,
    },
  });

  // Tags: delete then insert separately
  await prisma.projectTag.deleteMany({ where: { projectId: id } });
  if (tagIds.length) {
    await prisma.projectTag.createMany({
      data: tagIds.map(tagId => ({ projectId: id, tagId })),
    });
  }

  // Images: delete then insert separately
  await prisma.projectImage.deleteMany({ where: { projectId: id } });
  if (galleryImages.length) {
    await prisma.projectImage.createMany({
      data: galleryImages.map(img => ({ projectId: id, url: img.url, alt: img.alt || null, order: img.order })),
    });
  }

  // Categories: delete then insert separately
  await prisma.projectCategory.deleteMany({ where: { projectId: id } });
  if (categoryIds.length) {
    await prisma.projectCategory.createMany({
      data: categoryIds.map(categoryId => ({ projectId: id, categoryId })),
    });
  }

  revalidatePath('/admin/projects');
  revalidatePath(`/projects/${slug}`);
  revalidatePath('/projects');

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
