'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function markMessageStatus(id: string, status: 'READ' | 'REPLIED') {
  await prisma.contactMessage.update({ where: { id }, data: { status } });
  revalidatePath('/admin/messages');
}

export async function deleteMessage(id: string) {
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath('/admin/messages');
}
