'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

type Exp = { id: string; role: string; company: string; period: string; description: string };
type Edu = { id: string; degree: string; institution: string; year: string };
type Skl = { id: string; category: string; items: string[] };
type Cert = { id: string; name: string };

const fade = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

export default function AboutClient({
  name, title, bio, cvUrl, photoUrl,
  location, languages, availability,
  linkedin, github,
  experiences, educations, skills, certifications,
}: {
  name: string; title: string; bio: string; cvUrl: string; photoUrl?: string;
  location: string; languages: string; availability: string;
  linkedin?: string; github?: string;
  experiences: Exp[]; educations: Edu[]; skills: Skl[]; certifications: Cert[];
}) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="max-w-5xl mx-auto px-4 py-24">
      {/* Hero */}
      <motion.div initial="hidden" animate="visible" variants={fade} className="mb-20">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0 bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-4xl">{initials}</span>
            )}
          </div>
          <div>
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-3">{name}</h1>
            <p className="text-xl text-primary-600 dark:text-primary-400 font-medium mb-4">{title}</p>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6 max-w-2xl">{bio}</p>
            <div className="flex flex-wrap gap-3">
              {cvUrl && (
                <a href={cvUrl} download
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download CV
                </a>
              )}
              <Link href="/#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-14">
          {/* Experience */}
          {experiences.length > 0 && (
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                Experience
              </h2>
              <div className="space-y-6">
                {experiences.map(exp => (
                  <div key={exp.id} className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700">
                    <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-primary-500 border-2 border-white dark:border-slate-950" />
                    <div className="pb-2">
                      <h3 className="text-slate-900 dark:text-white font-semibold">{exp.role}</h3>
                      <div className="flex items-center gap-2 mt-0.5 mb-2">
                        <p className="text-primary-600 dark:text-primary-400 text-sm font-medium">{exp.company}</p>
                        {exp.period && <><span className="text-slate-400 text-xs">·</span><p className="text-slate-500 text-sm">{exp.period}</p></>}
                      </div>
                      {exp.description && <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Education */}
          {educations.length > 0 && (
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-accent-100 dark:bg-accent-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent-600 dark:text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </span>
                Education
              </h2>
              <div className="space-y-4">
                {educations.map(edu => (
                  <div key={edu.id} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 className="text-slate-900 dark:text-white font-semibold">{edu.degree}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-primary-600 dark:text-primary-400 text-sm">{edu.institution}</p>
                      {edu.year && <><span className="text-slate-400 text-xs">·</span><p className="text-slate-500 text-sm">{edu.year}</p></>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
                  </svg>
                </span>
                Technical Skills
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skills.map(group => (
                  <div key={group.id} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 className="font-semibold text-primary-600 dark:text-primary-400 text-sm mb-3">{group.category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map(skill => (
                        <span key={skill} className="px-2.5 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs border border-slate-200 dark:border-slate-600">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Certifications */}
          {certifications.length > 0 && (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}
              className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Certifications
              </h3>
              <ul className="space-y-2">
                {certifications.map(cert => (
                  <li key={cert.id} className="flex items-start gap-2 text-slate-600 dark:text-slate-400 text-sm">
                    <svg className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {cert.name}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Details */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}
            className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Details</h3>
            {[
              { label: 'Location', value: location },
              { label: 'Languages', value: languages },
              { label: 'Availability', value: availability },
            ].filter(i => i.value).map(item => (
              <div key={item.label}>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{item.label}</p>
                <p className="text-slate-700 dark:text-slate-300 text-sm mt-0.5">{item.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Social */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fade}
            className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Connect</h3>
            <div className="space-y-2">
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              )}
              {github && (
                <a href={github} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              )}
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}
