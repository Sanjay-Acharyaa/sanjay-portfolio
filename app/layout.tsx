import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Sanjay Acharya | Civil & Structural Engineer', template: '%s | Sanjay Acharya' },
  description: 'Civil and Structural Engineer specialising in structural design, transportation, and water resources.',
  keywords: ['civil engineer', 'structural engineer', 'construction estimator', 'Nepal'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
