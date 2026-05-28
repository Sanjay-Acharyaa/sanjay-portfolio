'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export type AboutFormState = { error?: string; fieldErrors?: Record<string, string> };

// ─── Experience ───────────────────────────────────────────────────────────────
export async function createExperience(_prev: AboutFormState, formData: FormData): Promise<AboutFormState> {
  const role = (formData.get('role') as string)?.trim();
  const company = (formData.get('company') as string)?.trim();
  const period = (formData.get('period') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const order = parseInt((formData.get('order') as string) || '0') || 0;

  if (!role) return { fieldErrors: { role: 'Role is required' } };
  if (!company) return { fieldErrors: { company: 'Company is required' } };
  if (!period) return { fieldErrors: { period: 'Period is required' } };
  if (!description) return { fieldErrors: { description: 'Description is required' } };

  await prisma.experience.create({ data: { role, company, period, description, order } });
  revalidatePath('/admin/about');
  revalidatePath('/about');
  return {};
}

export async function updateExperience(id: string, _prev: AboutFormState, formData: FormData): Promise<AboutFormState> {
  const role = (formData.get('role') as string)?.trim();
  const company = (formData.get('company') as string)?.trim();
  const period = (formData.get('period') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const order = parseInt((formData.get('order') as string) || '0') || 0;

  if (!role) return { fieldErrors: { role: 'Role is required' } };
  if (!company) return { fieldErrors: { company: 'Company is required' } };

  await prisma.experience.update({ where: { id }, data: { role, company, period: period || '', description: description || '', order } });
  revalidatePath('/admin/about');
  revalidatePath('/about');
  return {};
}

export async function deleteExperience(id: string): Promise<void> {
  await prisma.experience.delete({ where: { id } });
  revalidatePath('/admin/about');
  revalidatePath('/about');
}

// ─── Education ────────────────────────────────────────────────────────────────
export async function createEducation(_prev: AboutFormState, formData: FormData): Promise<AboutFormState> {
  const degree = (formData.get('degree') as string)?.trim();
  const institution = (formData.get('institution') as string)?.trim();
  const year = (formData.get('year') as string)?.trim();
  const order = parseInt((formData.get('order') as string) || '0') || 0;

  if (!degree) return { fieldErrors: { degree: 'Degree is required' } };
  if (!institution) return { fieldErrors: { institution: 'Institution is required' } };

  await prisma.education.create({ data: { degree, institution, year: year || '', order } });
  revalidatePath('/admin/about');
  revalidatePath('/about');
  return {};
}

export async function updateEducation(id: string, _prev: AboutFormState, formData: FormData): Promise<AboutFormState> {
  const degree = (formData.get('degree') as string)?.trim();
  const institution = (formData.get('institution') as string)?.trim();
  const year = (formData.get('year') as string)?.trim();
  const order = parseInt((formData.get('order') as string) || '0') || 0;

  if (!degree) return { fieldErrors: { degree: 'Degree is required' } };

  await prisma.education.update({ where: { id }, data: { degree, institution: institution || '', year: year || '', order } });
  revalidatePath('/admin/about');
  revalidatePath('/about');
  return {};
}

export async function deleteEducation(id: string): Promise<void> {
  await prisma.education.delete({ where: { id } });
  revalidatePath('/admin/about');
  revalidatePath('/about');
}

// ─── Skills ───────────────────────────────────────────────────────────────────
export async function createSkill(_prev: AboutFormState, formData: FormData): Promise<AboutFormState> {
  const category = (formData.get('category') as string)?.trim();
  const itemsRaw = (formData.get('items') as string)?.trim();
  const order = parseInt((formData.get('order') as string) || '0') || 0;

  if (!category) return { fieldErrors: { category: 'Category is required' } };
  if (!itemsRaw) return { fieldErrors: { items: 'At least one skill is required' } };

  const items = itemsRaw.split(',').map(s => s.trim()).filter(Boolean);
  await prisma.skill.create({ data: { category, items, order } });
  revalidatePath('/admin/about');
  revalidatePath('/about');
  return {};
}

export async function updateSkill(id: string, _prev: AboutFormState, formData: FormData): Promise<AboutFormState> {
  const category = (formData.get('category') as string)?.trim();
  const itemsRaw = (formData.get('items') as string)?.trim();
  const order = parseInt((formData.get('order') as string) || '0') || 0;

  if (!category) return { fieldErrors: { category: 'Category is required' } };

  const items = itemsRaw ? itemsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
  await prisma.skill.update({ where: { id }, data: { category, items, order } });
  revalidatePath('/admin/about');
  revalidatePath('/about');
  return {};
}

export async function deleteSkill(id: string): Promise<void> {
  await prisma.skill.delete({ where: { id } });
  revalidatePath('/admin/about');
  revalidatePath('/about');
}

// ─── Certifications ───────────────────────────────────────────────────────────
export async function createCertification(_prev: AboutFormState, formData: FormData): Promise<AboutFormState> {
  const name = (formData.get('name') as string)?.trim();
  const order = parseInt((formData.get('order') as string) || '0') || 0;

  if (!name) return { fieldErrors: { name: 'Certification name is required' } };

  await prisma.certification.create({ data: { name, order } });
  revalidatePath('/admin/about');
  revalidatePath('/about');
  return {};
}

export async function updateCertification(id: string, _prev: AboutFormState, formData: FormData): Promise<AboutFormState> {
  const name = (formData.get('name') as string)?.trim();
  const order = parseInt((formData.get('order') as string) || '0') || 0;

  if (!name) return { fieldErrors: { name: 'Certification name is required' } };

  await prisma.certification.update({ where: { id }, data: { name, order } });
  revalidatePath('/admin/about');
  revalidatePath('/about');
  return {};
}

export async function deleteCertification(id: string): Promise<void> {
  await prisma.certification.delete({ where: { id } });
  revalidatePath('/admin/about');
  revalidatePath('/about');
}
