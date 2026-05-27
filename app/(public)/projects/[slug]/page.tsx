import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return {};
  return {
    title: `${project.title} | Sanjay Acharya`,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: project.coverImage ? [{ url: project.coverImage }] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: {
      category: true,
      tags: { include: { tag: true } },
      images: { orderBy: { order: 'asc' } },
    },
  });

  if (!project) notFound();

  const allImages = [
    ...(project.coverImage ? [{ url: project.coverImage, alt: project.title }] : []),
    ...project.images.map(img => ({ url: img.url, alt: img.alt ?? project.title })),
  ];

  return (
    <article className="max-w-5xl mx-auto px-4 py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-8">
        <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/projects" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Projects</Link>
        <span>/</span>
        <span className="text-slate-700 dark:text-slate-200 truncate max-w-xs">{project.title}</span>
      </nav>

      {/* Hero Image */}
      {project.coverImage && (
        <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden mb-10 bg-slate-200 dark:bg-slate-800">
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </div>
      )}

      {/* Header */}
      <div className="mb-10">
        {project.category && (
          <span
            className="inline-block px-3 py-1 text-white text-xs font-semibold rounded-full mb-4"
            style={{ backgroundColor: project.category.color }}
          >
            {project.category.name}
          </span>
        )}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
          {project.title}
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
          {project.shortDescription}
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          {project.year && (
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Year</p>
              <p className="text-slate-700 dark:text-slate-300 font-semibold">{project.year}</p>
            </div>
          )}
          {project.location && (
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Location</p>
              <p className="text-slate-700 dark:text-slate-300 font-semibold">{project.location}</p>
            </div>
          )}
          {project.client && (
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Client</p>
              <p className="text-slate-700 dark:text-slate-300 font-semibold">{project.client}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-10">
          {/* Description */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Overview</h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">{project.description}</p>
            </div>
          </section>

          {/* Challenge */}
          {project.challenge && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Challenge</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">{project.challenge}</p>
            </section>
          )}

          {/* Solution */}
          {project.solution && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Solution</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">{project.solution}</p>
            </section>
          )}

          {/* Results */}
          {project.results.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Results</h2>
              <ul className="space-y-3">
                {project.results.map((r, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1 w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">{r}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Image Gallery */}
          {allImages.length > 1 && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Gallery</h2>
              <div className="grid grid-cols-2 gap-3">
                {allImages.slice(1).map((img, i) => (
                  <div key={i} className="relative h-48 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800">
                    <Image src={img.url} alt={img.alt} fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 50vw, 33vw" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(pt => (
                  <span key={pt.tag.id} className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs">
                    {pt.tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl p-5 text-white">
            <h3 className="font-bold mb-2">Interested in a similar project?</h3>
            <p className="text-sm text-white/80 mb-4">Let's discuss how I can help with your engineering needs.</p>
            <Link
              href="/#contact"
              className="inline-block w-full text-center py-2.5 bg-white text-primary-600 font-semibold rounded-lg text-sm hover:bg-slate-100 transition-colors"
            >
              Get in Touch
            </Link>
          </div>

          {/* Back */}
          <Link
            href="/projects"
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Projects
          </Link>
        </aside>
      </div>
    </article>
  );
}
