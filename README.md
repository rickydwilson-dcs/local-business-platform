# Colossus Scaffolding Website

Modern Next.js website for Colossus Scaffolding - professional scaffolding services across South East England. Built for optimal SEO performance and lead generation.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🛠️ Tech Stack

- **Next.js 15** with App Router
- **React 19** with Server Components
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **MDX** for content management

## 📧 Email Setup

Create `.env.local`:

```env
# Email configuration
RESEND_API_KEY=re_your_api_key_here
BUSINESS_EMAIL=your-business@email.com
BUSINESS_NAME=Colossus Scaffolding
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Upstash Redis (for rate limiting)
KV_REST_API_URL=https://your-database.upstash.io
KV_REST_API_TOKEN=your-token-here
```

## 📝 Content Management

**Unified MDX-Only Architecture** - All content managed exclusively through MDX frontmatter.

### Adding Services

1. Create `content/services/service-name.mdx`
2. Add comprehensive frontmatter (title, description, hero, specialists, FAQs, benefits)
3. Dynamic template renders all content from MDX frontmatter

### Adding Locations

1. Create `content/locations/location-name.mdx`
2. Add comprehensive frontmatter (hero, services, pricing, FAQs sections)
3. Dynamic template renders all content from MDX frontmatter

**Total Content:** 62 MDX files (25 services + 37 locations) - single source of truth.

## ✅ Content Validation

All MDX files are validated on commit:

```bash
# Validate all content
npm run validate:content

# Validate specific types
npm run validate:services
npm run validate:locations
```

Validation enforces:

- Description lengths (50-200 characters)
- FAQ requirements (3-15 per service)
- YAML syntax correctness
- Required frontmatter fields

See `CONTENT_VALIDATION.md` for details.

## 🚀 Deployment

Deploy to Vercel:

```bash
vercel
```

Or connect your GitHub repository for automatic deployments.

## 📞 Features

- ✅ Contact form with Upstash rate limiting and email notifications
- ✅ Zod-based content validation with pre-commit enforcement
- ✅ Upstash Redis rate limiting (distributed, serverless-compatible)
- ✅ SEO-optimized with structured data
- ✅ Mobile-responsive design
- ✅ Dynamic service and location pages
- ✅ Lead generation focused

## 📚 Documentation

- `ARCHITECTURE.md` - Technical architecture and design decisions
- `content/` - MDX content files for services and locations

---

Built for Colossus Scaffolding - Professional scaffolding services across South East England.
