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

export default function HeroSettingsForm({ settings }: { settings: Record<string, string> }) {
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
          Saved! Changes will appear on the homepage after the next page load.
        </div>
      )}

      <div>
        <label className="block text-slate-400 text-sm font-medium mb-1.5">
          Badge text <span className="text-slate-600 font-normal">(small pill above heading)</span>
        </label>
        <input
          name="hero_badge"
          defaultValue={settings.hero_badge}
          required
          className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
        />
      </div>

      <div>
        <label className="block text-slate-400 text-sm font-medium mb-1.5">
          Main heading
        </label>
        <input
          name="hero_title"
          defaultValue={settings.hero_title}
          required
          className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
        />
      </div>

      <div>
        <label className="block text-slate-400 text-sm font-medium mb-1.5">
          Subtitle paragraph
        </label>
        <textarea
          name="hero_subtitle"
          defaultValue={settings.hero_subtitle}
          required
          rows={3}
          className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors resize-none"
        />
      </div>

      <SubmitButton />
    </form>
  );
}
