'use client';

import { useTransition } from 'react';
import { markMessageStatus, deleteMessage } from '@/app/actions/messages';

interface Props {
  id: string;
  status: string;
}

export default function MessageActions({ id, status }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800">
      {status === 'UNREAD' && (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => markMessageStatus(id, 'READ'))}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          Mark as Read
        </button>
      )}
      {status !== 'REPLIED' && (
        <button
          disabled={isPending}
          onClick={() => startTransition(() => markMessageStatus(id, 'REPLIED'))}
          className="px-3 py-1.5 bg-primary-600/20 hover:bg-primary-600/30 border border-primary-600/30 text-primary-400 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          Mark as Replied
        </button>
      )}
      <button
        disabled={isPending}
        onClick={() => {
          if (!confirm('Delete this message?')) return;
          startTransition(() => deleteMessage(id));
        }}
        className="ml-auto px-3 py-1.5 bg-slate-800 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/30 text-slate-500 hover:text-red-400 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
