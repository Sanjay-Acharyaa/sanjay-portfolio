import { prisma } from '@/lib/prisma';
import { formatDate } from '@/lib/utils';
import MessageActions from '@/components/admin/MessageActions';

const statusLabel: Record<string, { text: string; classes: string }> = {
  UNREAD:  { text: 'New',     classes: 'bg-primary-600/20 text-primary-400 border-primary-600/30' },
  READ:    { text: 'Read',    classes: 'bg-slate-700 text-slate-400 border-slate-600' },
  REPLIED: { text: 'Replied', classes: 'bg-green-500/20 text-green-400 border-green-500/30' },
};

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const unread = messages.filter(m => m.status === 'UNREAD').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Messages</h1>
        <p className="text-slate-400 text-sm mt-1">
          {messages.length} total{unread > 0 ? ` · ${unread} unread` : ''}
        </p>
      </div>

      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl text-center py-16">
            <p className="text-slate-400">No messages yet</p>
          </div>
        ) : (
          messages.map((m) => {
            const badge = statusLabel[m.status] ?? statusLabel.READ;
            return (
              <div
                key={m.id}
                className={`bg-slate-900 border rounded-xl p-5 transition-colors ${
                  m.status === 'UNREAD' ? 'border-primary-600/40' : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-sm shrink-0">
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-slate-200 font-semibold text-sm">{m.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${badge.classes}`}>
                          {badge.text}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs">
                        {m.email}{m.phone ? ` · ${m.phone}` : ''}
                      </p>
                    </div>
                  </div>
                  <p className="text-slate-600 text-xs shrink-0">{formatDate(m.createdAt)}</p>
                </div>

                <p className="text-slate-300 text-sm font-medium mt-3">{m.subject}</p>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">{m.message}</p>

                <MessageActions id={m.id} status={m.status} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
