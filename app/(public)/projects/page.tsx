import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ProjectsClient from '@/components/ProjectsClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Portfolio of civil and structural engineering projects — structural design, transportation, water resources, and construction management.',
};

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([
    prisma.project.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    }),
    prisma.category.findMany({ orderBy: [{ order: 'asc' }, { name: 'asc' }] }),
  ]);

  const serialised = projects.map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    shortDescription: p.shortDescription,
    coverImage: p.coverImage,
    featured: p.featured,
    year: p.year,
    location: p.location,
    categories: p.categories.map(pc => ({ name: pc.category.name, color: pc.category.color })),
    tags: p.tags.map(pt => pt.tag.name),
  }));

  return <ProjectsClient projects={serialised} categories={categories} />;
}
