'use client';

import { useTransition } from 'react';
import { toggleProjectStatus } from '@/app/actions/projects';

interface Props {
  id: string;
  status: 'DRAFT' | 'PUBLISHED';
}

export default function ToggleStatusButton({ id, status }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => toggleProjectStatus(id, status))}
      disabled={pending}
      className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors disabled:opacity-60 border ${
        status === 'PUBLISHED'
          ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'
          : 'bg-slate-700 text-slate-400 border-slate-600 hover:bg-slate-600'
      }`}
      title={status === 'PUBLISHED' ? 'Click to unpublish' : 'Click to publish'}
    >
      {pending ? '…' : status === 'PUBLISHED' ? 'Live' : 'Draft'}
    </button>
  );
}
