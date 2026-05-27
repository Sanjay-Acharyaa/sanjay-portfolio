'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function createCategory(formData: FormData) {
  const name = (formData.get('name') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const color = (formData.get('color') as string) || '#0083cc';

  if (!name) return { error: 'Name is required' };

  const slug = slugify(name);
  const exists = await prisma.category.findUnique({ where: { slug } });
  if (exists) return { error: 'A category with this name already exists' };

  await prisma.category.create({ data: { name, slug, description, color } });
  revalidatePath('/admin/categories');
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const name = (formData.get('name') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const color = (formData.get('color') as string) || '#0083cc';

  if (!name) return { error: 'Name is required' };

  await prisma.category.update({
    where: { id },
    data: { name, description, color },
  });
  revalidatePath('/admin/categories');
  return { success: true };
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath('/admin/categories');
}
