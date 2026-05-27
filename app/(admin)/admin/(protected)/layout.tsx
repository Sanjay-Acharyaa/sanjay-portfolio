import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [session, unreadCount] = await Promise.all([
    auth(),
    prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
  ]);

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <AdminSidebar unreadMessages={unreadCount} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader user={session.user ?? {}} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
