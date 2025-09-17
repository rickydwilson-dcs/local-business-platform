# Development Workflow

This document outlines the development workflow for the Colossus Scaffolding website to ensure code quality and prevent issues from reaching production.

## Branch Structure

- **`dev`** - Development branch for all new features and bug fixes
- **`staging`** - Staging branch connected to staging deployment
- **`main`** - Main branch for production-ready code
- **`production`** - Production branch connected to live website

## Development Workflow

### 1. Development Phase

Always work in the `dev` branch:

```bash
git checkout dev
git pull origin dev

# Make your changes
# Test locally with: npm run dev
```

### 2. Pre-commit Checks

Before every commit, automated checks run via Husky pre-commit hooks:

- **ESLint** - Code linting and fixes
- **Prettier** - Code formatting
- **TypeScript** - Type checking (manual)

### 3. Manual Quality Checks

Before pushing to staging, run these commands in the `dev` branch:

```bash
# Run all quality checks
npm run pre-commit-check

# Individual checks:
npm run lint          # ESLint check
npm run lint:fix      # ESLint with auto-fix
npm run type-check    # TypeScript validation
npm run build         # Production build test
npm run format        # Prettier formatting
```

**⚠️ CRITICAL: Only push to staging if all these checks pass!**

### 4. Staging Deployment

Once development is complete and all checks pass:

```bash
# Push dev changes to staging
git checkout dev
git push origin dev:staging
```

This triggers staging deployment on Vercel where you can:

- Test the full application
- Verify all features work
- Check for any deployment-specific issues

### 5. Production Deployment

Only after staging is verified and working correctly:

```bash
# Push staging to main and production
git checkout staging
git pull origin staging
git push origin staging:main
git push origin staging:production
```

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Production build
npm run lint             # Run ESLint
npm run lint:fix         # Run ESLint with auto-fix
npm run format           # Format code with Prettier
npm run type-check       # Check TypeScript types
npm run pre-commit-check # Run all quality checks
```

## Pre-commit Hook Configuration

The project uses Husky and lint-staged for automated pre-commit checks:

- **Husky**: Manages git hooks
- **lint-staged**: Runs linters on staged files only
- **ESLint**: Catches code issues and enforces style
- **Prettier**: Ensures consistent code formatting

## Quality Gates

### Development Quality Gates ✅

- ESLint passing (no errors)
- Prettier formatting applied
- TypeScript compilation successful
- Local development server running
- Manual feature testing

### Staging Quality Gates ✅

- All development checks passing
- Production build successful
- No deployment errors on Vercel
- Full application testing on staging URL
- Cross-browser compatibility verified

### Production Quality Gates ✅

- Staging fully tested and approved
- All features working as expected
- Performance metrics acceptable
- SEO and accessibility verified

## Emergency Hotfixes

For critical production issues that need immediate deployment:

```bash
# Create hotfix branch from production
git checkout production
git checkout -b hotfix/critical-fix

# Make minimal changes
# Test thoroughly
npm run pre-commit-check

# Deploy through normal workflow
git push origin hotfix/critical-fix:staging
# Test staging, then:
git push origin hotfix/critical-fix:main
git push origin hotfix/critical-fix:production
```

## Troubleshooting

### Build Failures

- Check ESLint errors: `npm run lint`
- Check TypeScript errors: `npm run type-check`
- Clear Next.js cache: `rm -rf .next`

### Pre-commit Hook Issues

- Ensure Husky is installed: `npm run prepare`
- Check hook permissions: `chmod +x .husky/pre-commit`

### Deployment Issues

- Verify all environment variables are set in Vercel
- Check build logs in Vercel dashboard
- Ensure all dependencies are properly installed

## Best Practices

1. **Never skip quality checks** - They prevent production issues
2. **Test on staging first** - Always verify changes before production
3. **Make small, focused commits** - Easier to review and rollback
4. **Write descriptive commit messages** - Include what and why
5. **Use feature branches** - For larger features, create feature branches from `dev`
6. **Review changes** - Use GitHub PRs for team collaboration
7. **Monitor deployments** - Check Vercel deployment status and logs

## Rollback Procedure

If issues are discovered in production:

```bash
# Quick rollback to previous working commit
git checkout production
git reset --hard <previous-working-commit>
git push origin production --force

# Or revert specific problematic commit
git revert <problematic-commit-hash>
git push origin production
```

Remember: Prevention is better than cure. Following this workflow prevents most issues from reaching production.
