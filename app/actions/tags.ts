'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function createTag(formData: FormData) {
  const name = (formData.get('name') as string)?.trim();
  if (!name) return { error: 'Name is required' };

  const slug = slugify(name);
  const exists = await prisma.tag.findUnique({ where: { slug } });
  if (exists) return { error: 'Tag already exists' };

  await prisma.tag.create({ data: { name, slug } });
  revalidatePath('/admin/tags');
  return { success: true };
}

export async function deleteTag(id: string) {
  await prisma.tag.delete({ where: { id } });
  revalidatePath('/admin/tags');
}
