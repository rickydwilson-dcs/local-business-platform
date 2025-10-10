# Colossus Scaffolding - Documentation

Complete documentation for the Colossus Scaffolding Next.js website project.

## 📚 Documentation Structure

### 🏗️ Architecture

Core architectural guidelines, patterns, and standards.

- **[ARCHITECTURE.md](architecture/ARCHITECTURE.md)** - Complete architectural guidelines, styling standards, content patterns (1,456 lines)
  - MDX-only content architecture
  - Styling system (Tailwind CSS)
  - Component organization
  - SEO & schema patterns
  - Image optimization
  - Architecture violation detection

- **[CONTENT_VALIDATION.md](architecture/CONTENT_VALIDATION.md)** - Content validation rules, Zod schemas, troubleshooting
  - Validation schemas
  - Common validation errors
  - Troubleshooting guide

### 🔧 Development

Development workflow, tools, and procedures.

- **[DEVELOPMENT.md](development/DEVELOPMENT.md)** - Development workflow, git procedures, branch structure (451 lines)
  - Git workflow & branch structure
  - Pre-commit/pre-push hooks
  - Quality gates
  - CI/CD pipeline
  - Deployment procedures

- **[GITHUB_SETUP.md](development/GITHUB_SETUP.md)** - GitHub repository configuration
  - Branch protection rules
  - GitHub Actions setup
  - Environment variables
  - Secrets management

- **[BRANCH_PROTECTION_SETUP.md](development/BRANCH_PROTECTION_SETUP.md)** - Branch protection configuration guide
  - Complete setup instructions for all branches
  - Required status check names
  - Legacy check removal guide
  - Verification commands

- **[BRANCH_PROTECTION_QUICK_REFERENCE.md](development/BRANCH_PROTECTION_QUICK_REFERENCE.md)** - Branch protection quick reference
  - Quick setup checklist
  - Status check names (exact match required)
  - Verification commands

### 🧪 Testing

Testing infrastructure, guidelines, and performance monitoring.

- **[E2E_TESTING_STRATEGY.md](testing/E2E_TESTING_STRATEGY.md)** - Tiered E2E testing strategy ⚡️
  - Ultra-fast smoke tests (~15s local, ~3min CI)
  - Standard functional tests (~2-3min)
  - Comprehensive tests (~10min+)
  - Test tier selection guide
  - CI/CD workflow optimization

- **[E2E_TESTING.md](testing/E2E_TESTING.md)** - End-to-end testing with Playwright
  - Complete test suite overview (92 tests)
  - Running tests locally
  - Writing new tests
  - Accessibility testing (WCAG 2.1 AA)
  - Visual regression testing

- **[PERFORMANCE_TESTING.md](testing/PERFORMANCE_TESTING.md)** - Performance testing guide
  - Core Web Vitals monitoring
  - Performance thresholds
  - Lighthouse integration
  - Performance optimization

- **[PERFORMANCE_TRACKING.md](testing/PERFORMANCE_TRACKING.md)** - Performance test result tracking
  - Historical performance data
  - Trend analysis
  - Regression detection
  - Performance reports

### 🤖 AI Guidelines

Documentation for AI agents working with this codebase.

- **[CLAUDE.md](ai/CLAUDE.md)** - Claude Code instructions and guidelines
  - Mandatory reading list
  - Development commands
  - Architecture patterns
  - Common issues
  - Documentation maintenance

- **[AI_INSTRUCTIONS.md](ai/AI_INSTRUCTIONS.md)** - General AI agent instructions
  - Content accuracy standards
  - Writing style requirements
  - Implementation guidelines

### 📋 Project Management

- **[TODO.md](TODO.md)** - Current tasks and future planning

---

## 🚀 Quick Start

**New to this project?** Read these in order:

1. ✅ [README.md](../README.md) - Project overview (root)
2. ✅ [ARCHITECTURE.md](architecture/ARCHITECTURE.md) - Understand the architecture
3. ✅ [DEVELOPMENT.md](development/DEVELOPMENT.md) - Learn the development workflow
4. ✅ [CLAUDE.md](ai/CLAUDE.md) - Development commands and patterns

**Working with AI agents?**

- Start with [CLAUDE.md](ai/CLAUDE.md) for Claude Code
- See [AI_INSTRUCTIONS.md](ai/AI_INSTRUCTIONS.md) for general AI guidelines

**Adding tests?**

- [E2E_TESTING_STRATEGY.md](testing/E2E_TESTING_STRATEGY.md) - Tiered testing strategy
- [E2E_TESTING.md](testing/E2E_TESTING.md) - E2E tests setup & writing
- [PERFORMANCE_TESTING.md](testing/PERFORMANCE_TESTING.md) - Performance tests

**Setting up GitHub?**

- [GITHUB_SETUP.md](development/GITHUB_SETUP.md) - Complete GitHub configuration

---

## 📝 Documentation Standards

This project follows strict documentation standards:

- ✅ **Always up-to-date** - Documentation is updated with every code change
- ✅ **Comprehensive** - All features, patterns, and decisions documented
- ✅ **Example-driven** - Code examples for all patterns
- ✅ **Cross-referenced** - Links between related documentation
- ✅ **Organized** - Logical directory structure by topic

See [CLAUDE.md - Documentation Maintenance](ai/CLAUDE.md#documentation-maintenance-mandatory) for detailed documentation update requirements.

---

## 🔍 Finding Documentation

### By Topic

- **Architecture & Patterns:** [architecture/](architecture/)
- **Development Workflow:** [development/](development/)
- **Testing:** [testing/](testing/)
- **AI Guidelines:** [ai/](ai/)

### By Task

- **Setting up development environment:** [DEVELOPMENT.md](development/DEVELOPMENT.md#essential-development-commands)
- **Running tests:** [CLAUDE.md](ai/CLAUDE.md#testing)
- **Deploying to production:** [DEVELOPMENT.md](development/DEVELOPMENT.md#git-workflow--branch-structure)
- **Validating content:** [CONTENT_VALIDATION.md](architecture/CONTENT_VALIDATION.md)
- **Understanding MDX architecture:** [ARCHITECTURE.md](architecture/ARCHITECTURE.md#unified-mdx-only-content-architecture)
- **Writing performance tests:** [PERFORMANCE_TESTING.md](testing/PERFORMANCE_TESTING.md)

---

## 📊 Project Statistics

- **Documentation Files:** 11 markdown files
- **Total Lines:** ~5,000+ lines of documentation
- **Test Suite:** 141 unit tests + 92 E2E tests (7 smoke + 51 standard + 34 comprehensive)
- **Content Files:** 62 MDX files (25 services + 37 locations)
- **Code Quality:** ESLint + TypeScript + Pre-commit/push hooks + CI/CD

---

## 🆘 Getting Help

- **Documentation Issues:** Check the specific doc's troubleshooting section
- **Build Failures:** See [DEVELOPMENT.md - Common Issues](development/DEVELOPMENT.md#common-development-issues)
- **Content Validation:** See [CONTENT_VALIDATION.md](architecture/CONTENT_VALIDATION.md)
- **Architecture Questions:** See [ARCHITECTURE.md](architecture/ARCHITECTURE.md)

---

**Last Updated:** October 2025
**Maintained by:** Development Team
**Project:** Colossus Scaffolding Next.js Website
