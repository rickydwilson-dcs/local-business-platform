# Colossus Scaffolding - TODO List

Outstanding tasks and business objectives. For completed work history, see [CHANGELOG.md](CHANGELOG.md).

## 🎯 Marketing & SEO Tasks

### 1. Submit to Google My Business

- [ ] Create or claim Google My Business listing
- [ ] Add complete business information
- [ ] Upload photos of scaffolding projects
- [ ] Collect and respond to customer reviews
- [ ] Verify location information

### 2. Submit Sitemap to Search Engines

- [ ] Submit sitemap to Google Search Console (Google Webmaster Tools)
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Monitor indexing status and coverage
- [ ] Set up search engine notifications

## 📊 Performance Monitoring

### 3. Location-Service Pages Analysis

- [ ] Monitor performance and usefulness of Brighton Location-Service pages
- [ ] Monitor performance and usefulness of Canterbury Location-Service pages
- [ ] Collect data on:
  - Page views and engagement
  - Lead generation effectiveness
  - User behavior and conversion rates
  - Search rankings for location-specific services
- [ ] Assess if worthwhile extending to other locations based on performance data
- [ ] Make decision on scaling strategy for location-service pages

## 🌐 Domain Migration Tasks

### 4. Domain Migration to www.colossus-scaffolding.co.uk

- [ ] **Point DNS Records** - Configure A/CNAME records to point www.colossus-scaffolding.co.uk to Vercel
- [ ] **SSL Auto-Provisioning** - Let Vercel automatically provision SSL certificate
- [ ] **Environment Variables** - Update `NEXT_PUBLIC_SITE_URL=https://www.colossus-scaffolding.co.uk` in Vercel dashboard
- [ ] **HSTS Header** - Add Strict-Transport-Security header to next.config.ts (post-migration)
- [ ] **CAA Records** - Set up Certificate Authority Authorization DNS records
- [ ] **HSTS Preload** - Submit domain to browser HSTS preload list (optional)
- [ ] **Additional Monitoring** - Set up domain-specific monitoring and alerts

## 🔒 Security & Compliance Maintenance

### 5. Maintain A+ Security Grade

- [ ] **Quarterly Security Audits** - Regular review of security headers and implementations
- [ ] **Dependency Updates** - Monitor and update packages for security vulnerabilities
- [ ] **GDPR Compliance Review** - Ensure ongoing privacy policy and cookie consent accuracy
- [ ] **Performance Security Balance** - Monitor that security measures don't impact site performance
- [ ] **Environment Security Checks** - Verify all environments maintain security standards

---

_For complete project history and achievements, see [CHANGELOG.md](CHANGELOG.md)_
