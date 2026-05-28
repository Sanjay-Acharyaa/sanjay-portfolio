'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SETTING_DEFAULTS } from '@/lib/site-settings';

export async function getSiteSettings(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany();
  const map: Record<string, string> = { ...SETTING_DEFAULTS };
  for (const row of rows) map[row.key] = row.value;
  return map;
}

export type SettingsState = { error?: string; success?: boolean };

export async function updateSiteSettings(
  _prev: SettingsState,
  formData: FormData
): Promise<SettingsState> {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Not authenticated' };

  const updates = Object.keys(SETTING_DEFAULTS).map(key => {
    const value = (formData.get(key) as string)?.trim() ?? SETTING_DEFAULTS[key];
    return prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  });

  await Promise.all(updates);
  return { success: true };
}
