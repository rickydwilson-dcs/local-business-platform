# Documentation Standards

Guidelines for maintaining documentation in the Local Business Platform.

## Core Principles

### 1. Living Documentation

- Update docs in the same commit as code changes
- Never leave documentation outdated
- Remove obsolete information promptly
- Regular review of living docs (README, CLAUDE.md, CHANGELOG)

### 2. Clarity & Accessibility

- Write for developers unfamiliar with the codebase
- Use clear, concise language
- Provide examples for all patterns
- Include troubleshooting sections

### 3. Structure & Consistency

- Follow established templates
- Use consistent formatting
- Maintain logical hierarchy
- Keep related content together

---

## CLAUDE.md Standards

### Purpose

CLAUDE.md provides AI-specific context for Claude Code. It should be:

- **Concise** - Target 150-200 lines (max 300)
- **Actionable** - Focus on rules Claude must follow
- **Unique** - Don't duplicate content from other docs

### Progressive Disclosure

Use subdirectory CLAUDE.md files for context-specific information:

```
CLAUDE.md                           # Root (~180 lines) - universal rules
sites/colossus-reference/CLAUDE.md  # Site-specific context
packages/core-components/CLAUDE.md  # Package-specific context
```

Claude automatically loads subdirectory CLAUDE.md files when working in those paths.

### What to Include in Root CLAUDE.md

| Include                           | Don't Include                |
| --------------------------------- | ---------------------------- |
| Git workflow rules                | Detailed API documentation   |
| Critical architecture rules       | Content duplicated elsewhere |
| Essential commands                | Comprehensive examples       |
| "NEVER do X" rules                | Reference material           |
| Documentation update requirements | Site-specific details        |

### Content Guidelines

**Do:**

- Use tables for quick reference
- Keep sections focused (15-40 lines each)
- Link to detailed docs instead of duplicating
- Use emphasis for critical rules ("NEVER", "ALWAYS")

**Don't:**

- Inline full code examples (link to files instead)
- Repeat information from ARCHITECTURE.md
- Include environment-specific details in root
- Add comprehensive troubleshooting (keep brief)

---

## File Naming Conventions

### Root Level Files (UPPERCASE)

```
README.md           # Project overview
CLAUDE.md           # AI context
CHANGELOG.md        # Version history
LICENSE             # License file
```

### Documentation Files (lowercase with hyphens)

```
docs/
├── standards/
│   ├── content.md
│   ├── styling.md
│   └── documentation.md
├── guides/
│   ├── adding-service.md
│   └── git-workflow.md
└── architecture/
    └── ARCHITECTURE.md    # Major reference (UPPERCASE)
```

---

## Markdown Formatting

### Headings

```markdown
# H1 - Document Title (one per file)

## H2 - Major Sections

### H3 - Subsections

#### H4 - Details

Don't skip levels: H1 → H2 → H3 (not H1 → H3)
```

### Code Blocks

Always specify language for syntax highlighting:

````markdown
```bash
npm run build
```

```typescript
const data = await getContentItems("services");
```

```yaml
title: "Service Title"
description: "Description"
```
````

### Tables

```markdown
| Column 1 | Column 2 | Column 3 |
| -------- | -------- | -------- |
| Data 1   | Data 2   | Data 3   |
```

### Links

```markdown
# Internal links (relative paths)

[Architecture](../architecture/ARCHITECTURE.md)

# Link to heading

[See quality gates](#quality-gates)

# File references in prose

See `lib/content.ts` for implementation details.
```

---

## Living Documentation

### Files That Must Stay Current

| File                 | Update When          | Purpose               |
| -------------------- | -------------------- | --------------------- |
| CHANGELOG.md         | Every change         | Version history       |
| README.md            | Major features       | Project overview      |
| CLAUDE.md            | Architecture changes | AI context            |
| docs/standards/\*.md | Standards change     | Development standards |

### Update Triggers

**Update CLAUDE.md when:**

- Directory structure changes
- New commands added
- Architecture patterns change
- New "NEVER do X" rules needed

**Update CHANGELOG.md when:**

- Any code change committed
- Documentation improvements
- Dependencies updated
- Bug fixes applied

---

## Quality Checklist

### Before Committing Documentation

```yaml
content_quality:
  - [ ] Headings follow hierarchy (no skipped levels)
  - [ ] Code blocks have syntax highlighting
  - [ ] Links work (relative paths correct)
  - [ ] No spelling errors
  - [ ] Examples are accurate

formatting:
  - [ ] Consistent heading style
  - [ ] Tables properly formatted
  - [ ] Single blank line between sections
  - [ ] No trailing whitespace
```

### Link Validation

Prefer relative paths for internal links:

```markdown
# Good

[Standards](../standards/content.md)

# Bad - breaks if repo moves

[Standards](/docs/standards/content.md)
```

---

## Document Templates

### Standards Document

```markdown
# [Standard Name]

Brief description of what this standard covers.

## Overview

[2-3 sentences on purpose and scope]

---

## Rules

### Rule 1: [Name]

[Explanation]

**Do:**

- Correct approach

**Don't:**

- Incorrect approach

---

## Examples

[Concrete examples with code]

---

## Related Standards

- [Related 1](link)
- [Related 2](link)
```

### Guide Document

````markdown
# How to [Task]

Brief description of what this guide covers.

## Prerequisites

- Requirement 1
- Requirement 2

## Steps

### Step 1: [Action]

[Instructions]

```bash
# Command example
```
````

### Step 2: [Action]

[Instructions]

## Verification

How to verify success.

## Troubleshooting

### Problem: [Description]

**Solution:** [Fix]

## Related Guides

- [Related guide](link)

```

---

## Best Practices

### Do

- Write for newcomers to the codebase
- Provide concrete examples
- Update docs with code changes
- Link to related documentation
- Use consistent terminology
- Test all code examples

### Don't

- Assume prior knowledge
- Use jargon without explanation
- Write vague instructions
- Let docs get stale
- Use "click here" as link text
- Duplicate content across files

---

**Updated:** December 2025
```
