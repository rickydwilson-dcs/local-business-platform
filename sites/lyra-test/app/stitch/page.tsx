export default function StitchIndexPage() {
  const pages = [
    { slug: 'home', title: 'Home Page' },
    { slug: 'about', title: 'About Page' },
    { slug: 'contact', title: 'Contact Page' },
    { slug: 'services', title: 'Services Listing' },
    { slug: 'service-detail', title: 'Service Detail' },
  ];

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 600, margin: '60px auto', padding: '0 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Lyra — Stitch Design Viewer</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>
        Exact HTML exports from Google Stitch. Images downloaded locally.
      </p>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {pages.map((p) => (
          <li key={p.slug}>
            <a
              href={`/stitch/${p.slug}.html`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: '16px 20px',
                background: '#f5f5f5',
                borderRadius: 8,
                textDecoration: 'none',
                color: '#111',
                fontWeight: 500,
              }}
            >
              {p.title} →
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
