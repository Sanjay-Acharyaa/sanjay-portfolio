'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateSiteSettings, type SettingsState } from '@/app/actions/settings';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
    >
      {pending ? 'Saving…' : 'Save Changes'}
    </button>
  );
}

export default function ContactSettingsForm({ settings }: { settings: Record<string, string> }) {
  const [state, action] = useActionState<SettingsState, FormData>(updateSiteSettings, {});

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
          Saved! Contact details updated.
        </div>
      )}

      <div>
        <label className="block text-slate-400 text-sm font-medium mb-1.5">Email address</label>
        <input
          name="contact_email"
          type="email"
          defaultValue={settings.contact_email}
          className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-slate-400 text-sm font-medium mb-1.5">Phone number</label>
        <input
          name="contact_phone"
          defaultValue={settings.contact_phone}
          className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
          placeholder="+977 98XXXXXXXX"
        />
      </div>

      <div>
        <label className="block text-slate-400 text-sm font-medium mb-1.5">Location</label>
        <input
          name="contact_location"
          defaultValue={settings.contact_location}
          className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
          placeholder="Kathmandu, Nepal"
        />
      </div>

      <div>
        <label className="block text-slate-400 text-sm font-medium mb-1.5">LinkedIn URL</label>
        <input
          name="social_linkedin"
          defaultValue={settings.social_linkedin}
          className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
          placeholder="https://linkedin.com/in/..."
        />
      </div>

      <div>
        <label className="block text-slate-400 text-sm font-medium mb-1.5">GitHub URL</label>
        <input
          name="social_github"
          defaultValue={settings.social_github}
          className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
          placeholder="https://github.com/..."
        />
      </div>

      <SubmitButton />
    </form>
  );
}
