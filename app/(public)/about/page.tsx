import type { Metadata } from 'next';
import AboutClient from '@/components/AboutClient';

export const metadata: Metadata = {
  title: 'About',
  description: 'Civil and Structural Engineer with expertise in structural design, transportation systems, and water resources management. Based in Nepal.',
};

export default function AboutPage() {
  return <AboutClient />;
}
