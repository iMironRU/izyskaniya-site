import type { Metadata } from 'next';
import '@/styles/fonts';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Инженерные изыскания',
  description: 'Предварительная программа работ по геологии и топосъёмке',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-dvh bg-bg-page text-text-primary">{children}</body>
    </html>
  );
}
