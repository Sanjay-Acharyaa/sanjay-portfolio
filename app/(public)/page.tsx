import type { Metadata } from 'next';
import Link from 'next/link';
import Hero from '@/components/Hero';
import ProjectCard from '@/components/ProjectCard';
import { prisma } from '@/lib/prisma';
import ContactForm from '@/components/ContactForm';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sanjay Acharya | Civil & Structural Engineer',
  description: 'Civil and Structural Engineer based in Nepal specialising in structural design, transportation engineering, and water resources management.',
  openGraph: {
    title: 'Sanjay Acharya | Civil & Structural Engineer',
    description: 'Structural design, transportation engineering, and water resources management.',
    type: 'website',
  },
};

async function getFeaturedProjects() {
  return prisma.project.findMany({
    where: { status: 'PUBLISHED', featured: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
    include: {
      category: true,
      tags: { include: { tag: true } },
    },
  });
}

export default async function Home() {
  const projects = await getFeaturedProjects();

  return (
    <>
      <Hero />

      {/* Featured Projects */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Featured Work
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Showcase of selected projects across multiple disciplines
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p>No featured projects yet — check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                slug={project.slug}
                title={project.title}
                category={project.category?.name}
                categoryColor={project.category?.color}
                description={project.shortDescription}
                coverImage={project.coverImage}
                tags={project.tags.map(pt => pt.tag.name)}
                featured={project.featured}
                year={project.year}
                location={project.location}
              />
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              View All Projects
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Have a project in mind? Let&apos;s discuss how I can help.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
