import Link from 'next/link';
import { getSiteSettings } from '@/app/actions/settings';

export default async function Footer() {
  const settings = await getSiteSettings();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white border-t border-slate-800 mt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold mb-4">Sanjay Acharya</h3>
            <p className="text-slate-400">
              Designing solutions for complex infrastructure challenges.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/projects" className="hover:text-white transition">Work</Link></li>
              <li><Link href="/services" className="hover:text-white transition">Services</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/#contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <div className="flex gap-4 flex-col">
              {settings.social_linkedin && (
                <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition">
                  LinkedIn
                </a>
              )}
              {settings.social_github && (
                <a href={settings.social_github} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition">
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
          <p>&copy; {currentYear} Sanjay Acharya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
