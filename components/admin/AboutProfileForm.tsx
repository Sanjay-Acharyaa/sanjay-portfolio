'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateSiteSettings, type SettingsState } from '@/app/actions/settings';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
      {pending ? 'Saving…' : 'Save Changes'}
    </button>
  );
}

export default function AboutProfileForm({ settings }: { settings: Record<string, string> }) {
  const [state, action] = useActionState<SettingsState, FormData>(updateSiteSettings, {});

  return (
    <form action={action} className="space-y-4">
      {state.error && <p className="text-red-400 text-sm">{state.error}</p>}
      {state.success && <p className="text-green-400 text-sm">Saved!</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-slate-400 text-sm font-medium block mb-1.5">Full Name</label>
          <input name="about_name" defaultValue={settings.about_name}
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500 transition-colors" />
        </div>
        <div>
          <label className="text-slate-400 text-sm font-medium block mb-1.5">Professional Title</label>
          <input name="about_title" defaultValue={settings.about_title}
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500 transition-colors" />
        </div>
      </div>

      <div>
        <label className="text-slate-400 text-sm font-medium block mb-1.5">Bio paragraph</label>
        <textarea name="about_bio" defaultValue={settings.about_bio} rows={4}
          className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500 transition-colors resize-none" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-slate-400 text-sm font-medium block mb-1.5">
            CV URL <span className="text-slate-600 font-normal">(e.g. /resume.pdf or Cloudinary link)</span>
          </label>
          <input name="about_cv_url" defaultValue={settings.about_cv_url}
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500 transition-colors" />
        </div>
        <div>
          <label className="text-slate-400 text-sm font-medium block mb-1.5">Languages</label>
          <input name="about_languages" defaultValue={settings.about_languages}
            className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500 transition-colors" />
        </div>
      </div>

      <div>
        <label className="text-slate-400 text-sm font-medium block mb-1.5">Availability status</label>
        <input name="about_availability" defaultValue={settings.about_availability}
          className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500 transition-colors"
          placeholder="Open to projects" />
      </div>

      <SubmitButton />
    </form>
  );
}
