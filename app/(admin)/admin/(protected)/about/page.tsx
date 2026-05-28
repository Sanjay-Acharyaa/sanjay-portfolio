import { prisma } from '@/lib/prisma';
import { getSiteSettings } from '@/app/actions/settings';
import AboutManager from '@/components/admin/AboutManager';
import AboutProfileForm from '@/components/admin/AboutProfileForm';

export default async function AdminAboutPage() {
  const [settings, experiences, educations, skills, certifications] = await Promise.all([
    getSiteSettings(),
    prisma.experience.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] }),
    prisma.education.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] }),
    prisma.skill.findMany({ orderBy: [{ order: 'asc' }] }),
    prisma.certification.findMany({ orderBy: [{ order: 'asc' }] }),
  ]);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">About Page</h1>
        <p className="text-slate-400 text-sm mt-1">Edit your bio, experience, education, skills and certifications</p>
      </div>

      {/* Profile info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-white font-semibold text-sm mb-1">Profile</h2>
        <p className="text-slate-500 text-xs mb-5">Name, title, bio, CV link, languages and availability</p>
        <AboutProfileForm settings={settings} />
      </div>

      {/* Dynamic content */}
      <AboutManager
        experiences={experiences}
        educations={educations}
        skills={skills}
        certifications={certifications}
      />
    </div>
  );
}
