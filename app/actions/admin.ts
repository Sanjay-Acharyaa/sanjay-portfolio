'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export type PasswordChangeState = {
  error?: string;
  success?: boolean;
};

export type EmailChangeState = {
  error?: string;
  success?: boolean;
};

export async function changeAdminEmail(
  _prev: EmailChangeState,
  formData: FormData
): Promise<EmailChangeState> {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Not authenticated' };

  const newEmail = (formData.get('email') as string)?.trim().toLowerCase();
  const password = (formData.get('password') as string)?.trim();

  if (!newEmail || !password) return { error: 'All fields are required' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) return { error: 'Invalid email address' };

  const admin = await prisma.admin.findUnique({ where: { id: session.user.id } });
  if (!admin) return { error: 'Account not found' };

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return { error: 'Password is incorrect' };

  const existing = await prisma.admin.findUnique({ where: { email: newEmail } });
  if (existing && existing.id !== admin.id) return { error: 'Email already in use' };

  await prisma.admin.update({ where: { id: admin.id }, data: { email: newEmail } });

  return { success: true };
}

export async function changeAdminPassword(
  _prev: PasswordChangeState,
  formData: FormData
): Promise<PasswordChangeState> {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Not authenticated' };

  const current = (formData.get('current') as string)?.trim();
  const next = (formData.get('next') as string)?.trim();
  const confirm = (formData.get('confirm') as string)?.trim();

  if (!current || !next || !confirm) return { error: 'All fields are required' };
  if (next.length < 8) return { error: 'New password must be at least 8 characters' };
  if (next !== confirm) return { error: 'New passwords do not match' };

  const admin = await prisma.admin.findUnique({ where: { id: session.user.id } });
  if (!admin) return { error: 'Account not found' };

  const valid = await bcrypt.compare(current, admin.password);
  if (!valid) return { error: 'Current password is incorrect' };

  const hashed = await bcrypt.hash(next, 12);
  await prisma.admin.update({ where: { id: admin.id }, data: { password: hashed } });

  return { success: true };
}
