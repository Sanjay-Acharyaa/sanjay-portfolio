import { auth } from '@/lib/auth';
import PasswordChangeForm from '@/components/admin/PasswordChangeForm';
import EmailChangeForm from '@/components/admin/EmailChangeForm';
import HeroSettingsForm from '@/components/admin/HeroSettingsForm';
import { getSiteSettings } from '@/app/actions/settings';

export default async function AdminSettingsPage() {
  const [session, settings] = await Promise.all([auth(), getSiteSettings()]);

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account and site content</p>
      </div>

      {/* Account info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-white font-semibold text-sm">Account</h2>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">
              {session?.user?.name?.charAt(0).toUpperCase() ?? 'A'}
            </span>
          </div>
          <div>
            <p className="text-slate-200 font-semibold">{session?.user?.name}</p>
            <p className="text-slate-500 text-sm">{session?.user?.email}</p>
          </div>
        </div>
      </div>

      {/* Hero content */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-white font-semibold text-sm mb-1">Homepage Hero</h2>
        <p className="text-slate-500 text-xs mb-5">Edit the heading and text shown at the top of your homepage</p>
        <HeroSettingsForm settings={settings} />
      </div>

      {/* Email change */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-white font-semibold text-sm mb-5">Change Email</h2>
        <EmailChangeForm currentEmail={session?.user?.email ?? ''} />
      </div>

      {/* Password change */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-white font-semibold text-sm mb-5">Change Password</h2>
        <PasswordChangeForm />
      </div>
    </div>
  );
}
