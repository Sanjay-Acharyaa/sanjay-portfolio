import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Services | Sanjay Acharya',
  description: 'Civil and structural engineering services including structural design, transportation engineering, and water resources management.',
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-24">
      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">Services</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Comprehensive civil and structural engineering expertise tailored to your project needs.
        </p>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <p className="text-center text-slate-400">Services coming soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div
              key={service.id}
              className="group p-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg transition-all"
            >
              {/* Icon or number */}
              {service.icon ? (
                <div className="text-4xl mb-5">{service.icon}</div>
              ) : (
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-5">
                  <span className="text-primary-600 dark:text-primary-400 font-bold text-lg">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              )}
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {service.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-20 text-center bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-12 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
        <p className="text-white/80 mb-8 text-lg">
          Let's discuss your requirements and find the best engineering solution.
        </p>
        <Link
          href="/#contact"
          className="inline-block px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-slate-100 transition-colors"
        >
          Contact Me
        </Link>
      </div>
    </div>
  );
}
