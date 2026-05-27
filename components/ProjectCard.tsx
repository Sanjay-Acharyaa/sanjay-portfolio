'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ProjectCardProps {
  slug: string;
  title: string;
  category?: string | null;
  categoryColor?: string | null;
  description: string;
  coverImage?: string | null;
  tags?: string[];
  featured?: boolean;
  year?: number | null;
  location?: string | null;
}

export default function ProjectCard({
  slug,
  title,
  category,
  categoryColor,
  description,
  coverImage,
  tags = [],
  featured = false,
  year,
  location,
}: ProjectCardProps) {
  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }} className={featured ? 'md:col-span-2' : ''}>
      <Link href={`/projects/${slug}`} className="group block h-full">
        <div className="relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 shadow-sm hover:shadow-xl transition-shadow h-full flex flex-col">
          {/* Image */}
          <div className="relative h-60 overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
            {coverImage ? (
              <Image
                src={coverImage}
                alt={title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-400 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
            {category && (
              <div className="absolute top-3 right-3">
                <span
                  className="inline-block px-2.5 py-1 text-white text-xs font-semibold rounded-full"
                  style={{ backgroundColor: categoryColor ?? '#0083cc' }}
                >
                  {category}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 bg-white dark:bg-slate-900 flex flex-col flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
              {title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-3 line-clamp-2 flex-1">{description}</p>

            {(year || location) && (
              <p className="text-slate-400 dark:text-slate-600 text-xs mb-3">
                {[year, location].filter(Boolean).join(' · ')}
              </p>
            )}

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-1 text-primary-600 dark:text-primary-400 text-sm font-semibold mt-auto">
              View Project
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
