# Session: AI Content Generation System (Week 5)

**Start Date:** 2026-01-25
**End Date:** 2026-01-25
**Status:** Completed
**Objective:** Build AI-powered content generation tools with Claude and Gemini integration

## Summary

Implemented comprehensive AI content generation system for the Local Business Platform. Created tools to generate service and location pages using Claude (Anthropic) and Gemini (Google AI) with built-in quality validation, uniqueness checking, and business context awareness.

## Key Deliverables

### 1. AI Provider Abstraction Layer

- **File:** `tools/lib/ai-provider.ts`
- **Purpose:** Unified interface supporting multiple AI providers
- **Providers:** Claude (Anthropic API) and Gemini (Google AI)
- **Features:** Rate limiting, cost tracking, error handling

### 2. Service Page Generator

- **File:** `tools/generate-services.ts` (851 lines)
- **CLI Command:** `pnpm content:generate:services`
- **Capabilities:**
  - Generates complete service MDX files with frontmatter
  - Creates descriptions, benefits, process sections, FAQs
  - Uniqueness checking (70% similarity threshold, 3 regeneration attempts)
  - Integrates with business context system

### 3. Location Page Generator

- **File:** `tools/generate-locations.ts` (1,009 lines)
- **CLI Command:** `pnpm content:generate:locations`
- **Capabilities:**
  - Generates location-specific MDX content
  - Includes geographic data (postcodes, regions)
  - Local expertise and market knowledge sections
  - Tested with Kent and Sussex locations

### 4. Content Quality Validators

- **Location:** `sites/colossus-reference/lib/validators/`
- **CLI Command:** `npm run validate:quality` (site level)

**Validators:**

1. **Readability Validator** (`readability-validator.ts` - 375 lines)
   - Flesch Reading Ease score
   - Average sentence length analysis
   - Complex word detection

2. **SEO Validator** (`seo-validator.ts` - 349 lines)
   - Keyword density analysis
   - Meta description validation
   - Title optimization checks
   - Header structure analysis

3. **Uniqueness Validator** (`uniqueness-validator.ts` - 342 lines)
   - N-gram similarity detection
   - Cross-content comparison
   - Similarity threshold enforcement

### 5. Business Context System

- **File:** `tools/lib/business-context.ts` (449 lines)
- **Purpose:** Provide industry-specific context to AI generators
- **Features:**
  - Business profile structure
  - Service catalog integration
  - Brand voice guidelines
  - Industry-specific terminology

### 6. Content Prompts Library

- **Files:**
  - `tools/lib/content-prompts.ts` - Service generation prompts
  - `tools/lib/location-prompts.ts` (743 lines) - Location generation prompts
- **Purpose:** Structured prompt templates for consistent AI output

## Key Decisions

### 1. Multi-Provider Strategy

**Decision:** Support both Claude and Gemini from day one
**Rationale:**

- Cost optimization (compare pricing)
- Redundancy (fallback if one provider has issues)
- Quality comparison (test which produces better content)
- Future flexibility

### 2. Uniqueness Checking with Auto-Regeneration

**Decision:** Check similarity against existing content, regenerate if >70% similar
**Rationale:**

- Prevents duplicate content penalties from search engines
- Ensures each page offers unique value
- Maintains brand consistency while avoiding repetition
- Up to 3 attempts prevents infinite loops

### 3. Business Context Integration

**Decision:** Separate business context from generator logic
**Rationale:**

- Reusable across multiple content types
- Easy to update brand voice without touching code
- Supports multi-client scenarios
- Example context file serves as template

### 4. Site-Level Quality Validation

**Decision:** Validators run at site level (`npm run validate:quality`)
**Rationale:**

- Each site may have different quality standards
- Allows per-client customization
- Doesn't slow down root-level operations
- Integrated into development workflow

## Files Created/Modified

### New Files (28 total, 7,945 lines)

**Tools & Generators:**

- `tools/lib/ai-provider.ts` - AI provider abstraction
- `tools/generate-services.ts` (851 lines) - Service generator
- `tools/generate-locations.ts` (1,009 lines) - Location generator
- `tools/test-ai-connection.ts` - AI connection testing
- `tools/lib/content-prompts.ts` - Service prompts
- `tools/lib/location-prompts.ts` (743 lines) - Location prompts
- `tools/lib/business-context.ts` (449 lines) - Business context system
- `tools/examples/colossus-context.json` - Example context file

**Validators (3 files, 1,066 lines):**

- `sites/colossus-reference/lib/validators/readability-validator.ts` (375 lines)
- `sites/colossus-reference/lib/validators/seo-validator.ts` (349 lines)
- `sites/colossus-reference/lib/validators/uniqueness-validator.ts` (342 lines)

**Documentation:**

- `docs/architecture/CONTENT_VALIDATION.md` (60 lines)
- Updated `docs/guides/adding-service.md`
- Updated `docs/guides/adding-location.md`
- Updated `docs/standards/content.md`
- Updated `CHANGELOG.md` (84 lines added)
- Updated `docs/README.md` (31 lines added)

**Configuration:**

- Updated `.env.example` (AI API keys)
- Updated `package.json` (new CLI commands)

## Technical Details

### AI Provider Configuration

```typescript
// Supports both providers with same interface
const provider = new AIProvider({
  provider: "claude", // or 'gemini'
  apiKey: process.env.ANTHROPIC_API_KEY,
  maxTokens: 4000,
  temperature: 0.7,
});
```

### Content Generation Flow

1. Load business context from JSON
2. Generate content using AI provider
3. Check uniqueness against existing content
4. Regenerate if similarity > 70% (up to 3 attempts)
5. Validate quality (readability, SEO, uniqueness)
6. Write MDX file with frontmatter

### Quality Validation Thresholds

- **Readability:** Flesch Reading Ease > 60 (Standard)
- **SEO:** Keyword density 1-3%, meta description 120-160 chars
- **Uniqueness:** <70% similarity to existing content
- **Word Count:** Service descriptions 50-200 words

## Testing Results

### AI Connection Tests

- **Command:** `pnpm test:ai` (tests both providers)
- **Claude Test:** `pnpm test:ai:claude` ✅ Passed
- **Gemini Test:** `pnpm test:ai:gemini` ✅ Passed

### Manual Quality Review

- Generated 2 test service pages for colossus-reference
- Reviewed readability, tone, accuracy
- Confirmed uniqueness checking works correctly
- Validated SEO elements (keywords, meta descriptions)

### Content Validation

- All 62 existing MDX files pass quality checks
- New AI-generated content meets or exceeds quality thresholds
- Uniqueness validator successfully flags similar content

## Lessons Learned

### What Worked Well

1. **Provider abstraction** - Made switching between Claude/Gemini seamless
2. **Business context system** - Produces much better, brand-consistent content
3. **Uniqueness checking** - Prevents duplicate content issues early
4. **Separate validators** - Easy to add new quality checks independently

### Challenges

1. **API Rate Limits** - Had to implement backoff logic for high-volume generation
2. **Prompt Engineering** - Took several iterations to get consistent quality
3. **Geographic Data** - Location prompts needed more regional context
4. **Cost Estimation** - Token usage varies significantly by content type

### Improvements for Future

1. Add batch generation mode with progress tracking
2. Implement caching for generated content (avoid regeneration)
3. Add A/B testing framework for prompt variations
4. Create content review UI (approve/reject/regenerate)

## Cost Analysis

### Token Usage (Average per page)

- **Service Page:** ~2,500 tokens output (~$0.015 with Claude)
- **Location Page:** ~2,000 tokens output (~$0.012 with Claude)
- **Cost for 25 services:** ~$0.38
- **Cost for 37 locations:** ~$0.44
- **Total per site:** ~$0.82

### Projected Costs (50 sites)

- **Content generation:** ~$41 (one-time)
- **Maintenance/updates:** ~$5-10/month
- **Annual cost:** ~$100-150 (extremely low)

## Next Steps

### Immediate (Week 6)

- [x] Use AI tools to generate blog posts
- [x] Extend to project case studies
- [x] Create testimonial generation templates

### Short-term (Week 7-8)

- [ ] Build content review dashboard
- [ ] Add content versioning/regeneration
- [ ] Create industry-specific prompt libraries
- [ ] Implement content scheduling

### Long-term

- [ ] Train custom models on best-performing content
- [ ] Add multi-language support
- [ ] Implement A/B testing for AI-generated vs manual content
- [ ] Create client-facing content generation portal

## Related Issues/PRs

**Commit:** `bec7e12` - feat(tools): Add AI content generation and quality validators (Week 5)

**Dependencies Added:**

- `@anthropic-ai/sdk` - Claude API client
- `@google/generative-ai` - Gemini API client
- `yaml` - YAML parsing for MDX frontmatter
- `zod` - Schema validation

**Lockfile Update:** Commit `e16cd77` - fix(deps): Update pnpm-lock.yaml

## Documentation References

- [docs/architecture/CONTENT_VALIDATION.md](../../docs/architecture/CONTENT_VALIDATION.md)
- [docs/guides/adding-service.md](../../docs/guides/adding-service.md)
- [docs/guides/adding-location.md](../../docs/guides/adding-location.md)
- [docs/standards/content.md](../../docs/standards/content.md)
- [CHANGELOG.md](../../CHANGELOG.md) (Week 5 section)

## Notes

This was a critical milestone for the platform - AI content generation dramatically reduces the time to launch a new site from hours to minutes. The quality validation system ensures AI-generated content meets professional standards while the uniqueness checking prevents SEO penalties.

The multi-provider strategy proved valuable during development - Claude excelled at creative content while Gemini was faster for structured data. Having both options provides flexibility for different use cases and cost optimization.

The business context system is the secret sauce - it transforms generic AI output into brand-specific, industry-appropriate content that sounds human-written.
