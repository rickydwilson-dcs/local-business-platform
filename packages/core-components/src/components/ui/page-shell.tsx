/**
 * PageShell — Shared body shell for all platform sites.
 *
 * Wraps page content with:
 * - Skip-to-content accessibility link
 * - Site header slot
 * - Main content area (#main-content)
 * - Site footer slot
 *
 * Analytics, ConsentManager, and other client-only additions go OUTSIDE this
 * component in each site's layout.tsx — they sit directly in <body> after
 * PageShell and are site-specific.
 *
 * Usage in layout.tsx:
 * ```tsx
 * <body className="min-h-screen flex flex-col">
 *   <PageShell
 *     header={<SiteHeader ... />}
 *     footer={<Footer />}
 *   >
 *     {children}
 *   </PageShell>
 *   <ConsentManager ... />
 *   <Analytics ... />
 * </body>
 * ```
 */

export interface PageShellProps {
  children: React.ReactNode;
  /** Rendered site header (e.g. <SiteHeader .../>) */
  header: React.ReactNode;
  /** Rendered site footer (e.g. <Footer />) */
  footer: React.ReactNode;
}

export function PageShell({ children, header, footer }: PageShellProps) {
  return (
    <>
      {/* Skip-to-content link for keyboard / screen reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-brand-primary focus:text-white focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>

      {header}

      <main id="main-content" className="flex-1">
        {children}
      </main>

      {footer}
    </>
  );
}
