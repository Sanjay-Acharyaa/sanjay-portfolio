'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from './ProjectCard';
import type { Category } from '@prisma/client';

interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  coverImage: string | null;
  featured: boolean;
  year: number | null;
  location: string | null;
  categories: { name: string; color: string }[];
  tags: string[];
}

interface Props {
  projects: Project[];
  categories: Category[];
}

export default function ProjectsClient({ projects, categories }: Props) {
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const filtered = activeCat
    ? projects.filter(p => p.categories.some(c => c.name === activeCat))
    : projects;

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">All Projects</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          {projects.length} published project{projects.length !== 1 ? 's' : ''} across multiple disciplines
        </p>
      </motion.div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-12">
          <button
            onClick={() => setActiveCat(null)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeCat === null
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            All ({projects.length})
          </button>
          {categories.map(cat => {
            const count = projects.filter(p => p.categories.some(c => c.name === cat.name)).length;
            if (count === 0) return null;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.name)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCat === cat.name
                    ? 'text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
                style={activeCat === cat.name ? { backgroundColor: cat.color } : undefined}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p>No projects in this category yet.</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <ProjectCard
                  slug={project.slug}
                  title={project.title}
                  categories={project.categories}
                  description={project.shortDescription}
                  coverImage={project.coverImage}
                  tags={project.tags}
                  featured={project.featured}
                  year={project.year}
                  location={project.location}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
