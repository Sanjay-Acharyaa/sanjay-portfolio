import { prisma } from '@/lib/prisma';
import ServiceManager from '@/components/admin/ServiceManager';

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Services</h1>
        <p className="text-slate-400 text-sm mt-1">{services.length} service{services.length !== 1 ? 's' : ''}</p>
      </div>
      <ServiceManager services={services} />
    </div>
  );
}
