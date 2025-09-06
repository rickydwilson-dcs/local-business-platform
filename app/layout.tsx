import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Colossus Scaffolding',
  description: 'Safe, tidy scaffolding across East Sussex — temporary roofs, access scaffolds, stairs, and more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <header className="border-b">
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-semibold">Colossus Scaffolding</Link>
            <nav className="flex gap-6 text-sm">
              <Link href="/services">Services</Link>
              <Link href="/locations">Areas</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>

        <footer className="border-t">
          <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-slate-600 grid gap-2">
            <div>© {new Date().getFullYear()} Colossus Scaffolding</div>
            <div>East Sussex • TG20:21 compliant • Public liability cover</div>
          </div>
        </footer>
      </body>
    </html>
  )
}
