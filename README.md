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
RESEND_API_KEY=re_your_api_key_here
BUSINESS_EMAIL=your-business@email.com
BUSINESS_NAME=Colossus Scaffolding
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 📝 Content Management

### Adding Services

1. Create `content/services/service-name.mdx`
2. Add basic frontmatter (title, description)
3. Service details go in the page component's `serviceDataMap`

### Adding Locations

1. Create `content/locations/location-name.mdx`
2. Add comprehensive frontmatter with hero, services, pricing sections
3. Single template handles all locations automatically

## 🚀 Deployment

Deploy to Vercel:

```bash
vercel
```

Or connect your GitHub repository for automatic deployments.

## 📞 Features

- ✅ Contact form with email notifications
- ✅ SEO-optimized with structured data
- ✅ Mobile-responsive design
- ✅ Dynamic service and location pages
- ✅ Lead generation focused

## 📚 Documentation

- `ARCHITECTURE.md` - Technical architecture and design decisions
- `content/` - MDX content files for services and locations

---

Built for Colossus Scaffolding - Professional scaffolding services across South East England.
