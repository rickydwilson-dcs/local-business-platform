import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import '@/lib/register-all-themes';
import { getRegisteredThemes } from '@platform/theme-system';

export const metadata: Metadata = {
  title: 'Element Showcase — Local Business Platform',
  description: 'Visual component showcase across all platform themes',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen">
          <nav className="w-56 shrink-0 border-r border-gray-200 bg-white p-6 sticky top-0 h-screen overflow-y-auto">
            <p className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-6">Showcase</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="block py-1 text-gray-700 hover:text-indigo-600 font-medium">Browse</Link></li>
              <li><Link href="/compare" className="block py-1 text-gray-700 hover:text-indigo-600 font-medium">Compare</Link></li>
              <li className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Themes</p>
                <ul className="space-y-1">
                  {getRegisteredThemes().map(t => (
                    <li key={t.name}>
                      <Link href={`/themes/${t.name}`} className="block py-1 text-gray-700 hover:text-indigo-600 font-medium">
                        {t.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

export default RootLayout;
