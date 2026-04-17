# DJ Fox Blog Implementation - Parallel Subagent Strategy

**Date:** 2026-02-15
**Status:** Plan Updated - Ready for Execution
**Plan Location:** `/Users/rickywilson/.claude/plans/djfox-blog-implementation.md`

---

## What Was Updated

The blog implementation plan has been enhanced with a **parallel subagent content generation strategy** as the new recommended approach (Option A).

### Key Changes

#### 1. New Option A: Parallel Subagent Generation (RECOMMENDED)

**What it does:**

- Launches multiple specialized `cs-content-creator` agents in parallel
- Each agent gets fresh context (no token limits or context pollution)
- Generates 4-8 blog posts simultaneously in ~45 minutes
- All 20 posts can be completed in 1-2 weeks instead of 20 weeks

**Why it's better:**

- **Fastest:** 3-4 hours generation time for all 20 posts (vs 80-100 hours manual)
- **Most cost-effective:** £1,210-2,270 total (vs £4,400-6,000 manual)
- **Highest quality:** Each agent has full context and specialized content creation skills
- **Scalable:** Can generate posts in parallel batches without bottlenecks
- **Consistent:** All posts follow the same template and SEO standards

**How it works:**

1. Batch posts into groups of 4-8 (by phase: Foundation, Service Coverage, Authority, etc.)
2. Launch one `cs-content-creator` agent per post
3. Each agent receives:
   - Full blog strategy document
   - Specific post requirements (keywords, structure, word count)
   - Blog template to follow
   - Site config (business info, service areas)
   - SEO checklist
4. Agents generate complete MDX files with:
   - Proper frontmatter (title, description, keywords, heroImage, etc.)
   - 1,500-2,500 words of SEO-optimized content
   - H2/H3 heading structure
   - FAQ section (4-6 questions)
   - Local context (Eastbourne/East Sussex)
   - Internal links to service/location pages
   - External authoritative links
   - Strong CTA sections
5. Human review/polish (1-2 hours per post):
   - Verify technical accuracy
   - Check local information
   - Ensure brand voice consistency
   - Add personal anecdotes if needed

#### 2. Execution Commands Added

Added detailed step-by-step commands for launching subagents:

**Example prompt to launch 4 agents for foundation posts:**

```
Launch 4 cs-content-creator agents in parallel to create the foundation blog posts for DJ Fox Electrical.

For each agent, provide:
1. Blog strategy: output/sessions/2026-02-15_eastbourne-electrical-blog-strategy.md
2. Blog template: /Users/rickywilson/.claude/plans/djfox-blog-implementation.md (section 1.2)
3. Site config: sites/dj-fox-electrical/site.config.ts
4. Output location: sites/dj-fox-electrical/content/blog/

Agent 1 - Post #1: EICR Testing in Eastbourne
- Target keywords: "EICR Eastbourne", "electrical safety certificate"
- Slug: eicr-testing-eastbourne
- Word count: 2,000
- Include: Cost breakdown, legal requirements, process timeline, local areas covered

Agent 2 - Post #2: EV Charger Installation Brighton & Eastbourne
[...]

Agent 3 - Post #9: NICEIC vs NAPIT Guide
[...]

Agent 4 - Post #15: Electrician Prices Eastbourne 2026
[...]

Each agent should:
- Generate complete MDX file with proper frontmatter
- Follow blog template structure exactly
- Include 5-7 H2 sections with H3 subsections
- Add FAQ section (4-6 questions)
- Include local context section (Eastbourne/East Sussex)
- Add 3-5 internal links to service/location pages
- Add 1-2 external authoritative links (gov.uk, NICEIC, etc.)
- Write compelling meta description (150-160 chars)
- Use primary keyword in first 100 words and in H1
- Include strong CTA section at end
```

#### 3. Updated Budget Estimates

**Option A (Parallel Subagents) - BEST ROI:**

- Total cost: £1,210-2,270 (API + review labor)
- Timeline: 1-2 weeks
- Quality: High (with human review)
- Speed: Fastest

**Comparison:**

- Manual writing: £4,400-6,000, 20 weeks
- AI script (sequential): £1,400-4,000, 4-10 weeks
- Subagents (parallel): £1,210-2,270, 1-2 weeks ✅

#### 4. Updated Timeline (Next Steps)

**New accelerated schedule using subagents:**

- **Week 1:** Launch batch 1 (posts 1, 2, 9, 15) → Foundation phase complete
- **Week 2:** Launch batch 2 (posts 3, 4, 5, 6) → Service coverage complete
- **Week 3:** Launch batch 3 (posts 10, 11, 12, 13) → Authority building complete
- **Week 4:** Launch batch 4 (posts 7, 8, 14, 16) → Specialized services complete
- **Week 5:** Launch batch 5 (posts 17, 18, 19, 20) → Trends & guides complete

**Result:** All 20 blog posts published within 5 weeks (vs 20 weeks manual)

---

## What to Do Next

### Option 1: Start Immediately with Foundation Posts

Use this command in a new Claude conversation:

```
I want to create the first 4 foundation blog posts for DJ Fox Electrical using the parallel subagent strategy outlined in /Users/rickywilson/.claude/plans/djfox-blog-implementation.md

Launch 4 cs-content-creator agents in parallel following the execution commands in the plan (section "Execution Commands → Option A: Parallel Subagent Generation").

Generate posts 1, 2, 9, and 15 as specified in the plan.
```

### Option 2: Review Plan First

Read the full updated plan:

```bash
cat /Users/rickywilson/.claude/plans/djfox-blog-implementation.md
```

Review the:

- Full blog strategy (source): `output/sessions/2026-02-15_eastbourne-electrical-blog-strategy.md`
- Updated implementation approach (Option A details)
- Execution commands with specific prompts
- Budget and timeline estimates

### Option 3: Set Up Blog Template First

Before generating posts, create the blog template:

```bash
# Create template file
touch sites/dj-fox-electrical/content/blog/_TEMPLATE.mdx

# Copy template content from plan section 1.2
# (Found in djfox-blog-implementation.md lines 45-132)
```

---

## Parallel Processes Status

### Image Generation (Still Running)

The background image generation process is still running and making good progress:

**Current status:** Generating service images (Electric Shower Installation)

**Progress estimate:**

- Main page images: ✅ Complete (15 images)
- Service images: 🔄 In progress (~60% complete)
- Location images: ⏳ Pending (26 images)
- Blog images: ⏳ Not started (will need separate run)

**Estimated completion:** 2-3 hours from now

**Log file:** `output/image-generation.log`

**What to do when complete:**

1. Review generated images for quality
2. Upload to R2 bucket: `local-business-platform/djfoxelectrical/`
3. Verify images load on site

---

## Benefits of Subagent Approach

### Speed

- **20x faster generation** than manual writing
- **5x faster** than sequential AI scripts
- All 20 posts in 1-2 weeks vs 5 months

### Cost

- **72% cheaper** than manual writing (£1,210-2,270 vs £4,400-6,000)
- Comparable to AI scripts but much faster
- Minimal API costs (~£10-20 for all posts)

### Quality

- Fresh context per agent (no token limits)
- Specialized content creation agent per post
- Consistent SEO optimization
- Human review/polish layer included

### Scalability

- Can scale to 50, 100, or 200 posts easily
- No bottlenecks from sequential processing
- Each batch takes ~45 minutes regardless of size (within reason)

### Maintenance

- Easy to regenerate posts if needed
- Can update multiple posts simultaneously
- Same approach works for future content

---

## Technical Architecture

### How Subagents Work

1. **Task Tool Launch:**

   ```typescript
   Task({
     subagent_type: "cs-content-creator",
     prompt: "Create blog post #1: EICR Testing Eastbourne...",
     description: "Generate EICR blog post",
   });
   ```

2. **Fresh Context:**
   - Each agent starts with empty context
   - Receives only what's needed for that specific post
   - No contamination from other posts
   - No token limit issues

3. **Parallel Execution:**
   - 4-8 agents run simultaneously
   - Each agent is independent
   - Results come back when each completes
   - No waiting for sequential processing

4. **Output Validation:**
   ```bash
   # After generation
   npm run validate:content
   # Checks all MDX frontmatter against schemas
   ```

### Integration with Existing Tools

**Works with:**

- Existing MDX content system
- Blog schema validation (`npm run validate:content`)
- Image generation (`tools/generate-djfox-images.ts`)
- Deployment workflow (`/deploy.changes`)

**Doesn't require:**

- New blog generation scripts
- Database changes
- Template modifications
- Build process changes

---

## Comparison: Manual vs AI Script vs Subagents

| Aspect              | Manual        | AI Script        | Subagents            |
| ------------------- | ------------- | ---------------- | -------------------- |
| **Time per post**   | 4-5 hours     | 1-2 hours        | 15 min (parallel)    |
| **Total time (20)** | 80-100 hours  | 20-40 hours      | 5-10 hours           |
| **Timeline**        | 20 weeks      | 4-10 weeks       | 1-2 weeks            |
| **Cost per post**   | £200-300      | £70-200          | £60-115              |
| **Total cost (20)** | £4,400-6,000  | £1,400-4,000     | £1,210-2,270         |
| **Quality**         | Highest       | Medium-High      | High                 |
| **Consistency**     | Variable      | Good             | Excellent            |
| **Scalability**     | Poor          | Medium           | Excellent            |
| **Context limits**  | N/A           | Yes (sequential) | No (fresh per agent) |
| **Review needed**   | Minimal       | Moderate         | Moderate             |
| **Best for**        | Small batches | Medium batches   | Large batches        |

**Winner:** Subagents for speed, cost, scalability, and quality at scale

---

## Risk Mitigation

### Risk: Generated content lacks authenticity

**Mitigation:**

- Human review/polish included (1-2 hours per post)
- Add personal anecdotes during review
- Verify all technical details
- Inject local knowledge and examples

### Risk: Inconsistent brand voice

**Mitigation:**

- All agents use same template
- Same site config provided to all agents
- Review phase ensures consistency
- Can regenerate posts if needed

### Risk: SEO optimization missed

**Mitigation:**

- SEO checklist provided to each agent
- Content schemas enforce SEO requirements
- Validation catches missing elements
- Human review verifies keyword usage

### Risk: Technical inaccuracies

**Mitigation:**

- Review phase verifies all technical content
- Subject matter expert (Daniel Fox) final review
- Reference authoritative sources (NICEIC, gov.uk)
- Include disclaimers where appropriate

---

## Success Metrics

### Immediate (Week 1-2)

- ✅ First 4 posts published
- ✅ All posts validate without errors
- ✅ Hero images generated and uploaded
- ✅ Posts indexed by Google

### Short-term (Month 1-3)

- 🎯 20 posts published (all phases complete)
- 🎯 100+ organic blog visits/month
- 🎯 5-10 keywords in top 50
- 🎯 5%+ blog → contact form conversion

### Long-term (Month 6+)

- 🎯 500+ organic blog visits/month
- 🎯 10+ keywords in top 10
- 🎯 10-15% conversion rate
- 🎯 50-75 qualified leads/month from blog

---

## Files Reference

**Plan File:**

- `/Users/rickywilson/.claude/plans/djfox-blog-implementation.md`

**Blog Strategy (Source):**

- `output/sessions/2026-02-15_eastbourne-electrical-blog-strategy.md`

**Site Config:**

- `sites/dj-fox-electrical/site.config.ts`

**Content Location:**

- `sites/dj-fox-electrical/content/blog/`

**Image Generation:**

- `tools/generate-djfox-images.ts` (running in background)

**Validation:**

- `npm run validate:content` (from site directory)

---

## Ready to Execute

The blog implementation plan is now optimized for parallel subagent generation and ready for immediate execution.

**Recommended first step:**

Launch the first batch of 4 subagents to create foundation posts (1, 2, 9, 15) using the prompt provided in the "Execution Commands" section of the plan.

This will:

- Generate 4 complete blog posts in ~45 minutes
- Prove the subagent workflow
- Provide immediate content for the site
- Establish the template for remaining posts

**Time investment:** 45 min generation + 4 hours review = ~5 hours for first 4 posts

**After that:** Repeat the process for remaining 16 posts in 4 more batches over the next 4 weeks.
