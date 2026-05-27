'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitContact, type ContactState } from '@/app/actions/contact';
import { cn } from '@/lib/utils';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Sending…
        </>
      ) : 'Send Message'}
    </button>
  );
}

const field = 'w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors';
const fieldError = 'border-red-400 dark:border-red-500';

export default function ContactForm() {
  const [state, action] = useActionState<ContactState, FormData>(submitContact, {});

  if (state.success) {
    return (
      <div className="text-center py-12 px-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h3>
        <p className="text-slate-500 dark:text-slate-400">
          Thank you for reaching out. I'll get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-5">
      {state.error && (
        <div className="px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            type="text"
            required
            placeholder="Sanjay Acharya"
            className={cn(field, state.fieldErrors?.name && fieldError)}
          />
          {state.fieldErrors?.name && <p className="text-red-500 text-xs mt-1">{state.fieldErrors.name}</p>}
        </div>
        <div>
          <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className={cn(field, state.fieldErrors?.email && fieldError)}
          />
          {state.fieldErrors?.email && <p className="text-red-500 text-xs mt-1">{state.fieldErrors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">Phone</label>
          <input
            name="phone"
            type="tel"
            placeholder="+977 98XXXXXXXX"
            className={field}
          />
        </div>
        <div>
          <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            name="subject"
            type="text"
            required
            placeholder="Project Inquiry"
            className={cn(field, state.fieldErrors?.subject && fieldError)}
          />
          {state.fieldErrors?.subject && <p className="text-red-500 text-xs mt-1">{state.fieldErrors.subject}</p>}
        </div>
      </div>

      <div>
        <label className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell me about your project…"
          className={cn(field, 'resize-none', state.fieldErrors?.message && fieldError)}
        />
        {state.fieldErrors?.message && <p className="text-red-500 text-xs mt-1">{state.fieldErrors.message}</p>}
      </div>

      <SubmitButton />
    </form>
  );
}
