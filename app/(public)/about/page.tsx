import type { Metadata } from 'next';
import AboutClient from '@/components/AboutClient';
import { getSiteSettings } from '@/app/actions/settings';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About',
  description: 'Civil and Structural Engineer with expertise in structural design, transportation systems, and water resources management. Based in Nepal.',
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return <AboutClient linkedin={settings.social_linkedin} github={settings.social_github} />;
}
