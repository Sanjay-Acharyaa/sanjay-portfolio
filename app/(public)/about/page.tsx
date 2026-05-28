import type { Metadata } from 'next';
import AboutClient from '@/components/AboutClient';
import { getSiteSettings } from '@/app/actions/settings';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About',
  description: 'Civil and Structural Engineer with expertise in structural design, transportation systems, and water resources management. Based in Nepal.',
};

export default async function AboutPage() {
  const [settings, experiences, educations, skills, certifications] = await Promise.all([
    getSiteSettings(),
    prisma.experience.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] }),
    prisma.education.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] }),
    prisma.skill.findMany({ orderBy: [{ order: 'asc' }] }),
    prisma.certification.findMany({ orderBy: [{ order: 'asc' }] }),
  ]);

  return (
    <AboutClient
      name={settings.about_name}
      title={settings.about_title}
      bio={settings.about_bio}
      cvUrl={settings.about_cv_url}
      location={settings.contact_location}
      languages={settings.about_languages}
      availability={settings.about_availability}
      linkedin={settings.social_linkedin}
      github={settings.social_github}
      experiences={experiences}
      educations={educations}
      skills={skills}
      certifications={certifications}
    />
  );
}
