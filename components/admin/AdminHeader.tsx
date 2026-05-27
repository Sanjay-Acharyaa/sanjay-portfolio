'use client';

import { signOut } from 'next-auth/react';

interface Props {
  user: { name?: string | null; email?: string | null };
}

export default function AdminHeader({ user }: Props) {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
      <div />

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-slate-200 text-sm font-medium leading-none">{user.name}</p>
          <p className="text-slate-500 text-xs mt-0.5">{user.email}</p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors text-sm"
          title="Sign out"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign out
        </button>
      </div>
    </header>
  );
}
