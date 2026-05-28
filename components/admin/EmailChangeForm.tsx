'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { changeAdminEmail, type EmailChangeState } from '@/app/actions/admin';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors"
    >
      {pending ? 'Saving…' : 'Update Email'}
    </button>
  );
}

export default function EmailChangeForm({ currentEmail }: { currentEmail: string }) {
  const [state, action] = useActionState<EmailChangeState, FormData>(changeAdminEmail, {});

  if (state.success) {
    return (
      <div className="px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
        Email updated. Please sign out and sign back in for the change to take effect.
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      {state.error && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-slate-400 text-sm font-medium mb-1.5">New Email Address</label>
        <input
          type="email"
          name="email"
          required
          defaultValue={currentEmail}
          className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="block text-slate-400 text-sm font-medium mb-1.5">Confirm with Password</label>
        <input
          type="password"
          name="password"
          required
          className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
          placeholder="••••••••"
        />
      </div>

      <SubmitButton />
    </form>
  );
}
