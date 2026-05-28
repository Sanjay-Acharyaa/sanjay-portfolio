'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export type ServiceFormState = { error?: string; fieldErrors?: Record<string, string> };

export async function createService(
  _prev: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  const title = (formData.get('title') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const icon = (formData.get('icon') as string)?.trim() || null;
  const order = parseInt((formData.get('order') as string) || '0') || 0;

  if (!title) return { fieldErrors: { title: 'Title is required' } };
  if (!description) return { fieldErrors: { description: 'Description is required' } };

  const baseSlug = slugify(title);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.service.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  await prisma.service.create({
    data: { title, slug, description, icon, order, published: true },
  });

  revalidatePath('/admin/services');
  revalidatePath('/services');
  return {};
}

export async function updateService(
  id: string,
  _prev: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  const title = (formData.get('title') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const icon = (formData.get('icon') as string)?.trim() || null;
  const order = parseInt((formData.get('order') as string) || '0') || 0;

  if (!title) return { fieldErrors: { title: 'Title is required' } };
  if (!description) return { fieldErrors: { description: 'Description is required' } };

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) return { error: 'Service not found' };

  let slug = existing.slug;
  if (slugify(title) !== slugify(existing.title)) {
    const baseSlug = slugify(title);
    slug = baseSlug;
    let suffix = 1;
    while (await prisma.service.findUnique({ where: { slug, NOT: { id } } })) {
      slug = `${baseSlug}-${suffix++}`;
    }
  }

  await prisma.service.update({
    where: { id },
    data: { title, slug, description, icon, order },
  });

  revalidatePath('/admin/services');
  revalidatePath('/services');
  return {};
}

export async function deleteService(id: string): Promise<void> {
  await prisma.service.delete({ where: { id } });
  revalidatePath('/admin/services');
  revalidatePath('/services');
}

export async function toggleServicePublished(id: string, current: boolean): Promise<void> {
  await prisma.service.update({
    where: { id },
    data: { published: !current },
  });
  revalidatePath('/admin/services');
  revalidatePath('/services');
}
