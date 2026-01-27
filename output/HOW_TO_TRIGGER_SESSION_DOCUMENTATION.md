# How to Trigger Session Documentation

This document explains when and how session documentation should be created, both automatically and manually.

## The Problem

Session documentation was not being created automatically for recent work (Weeks 5-6, domain configuration, layout refactoring). This is a gap in the workflow that needs to be addressed.

## Root Cause

**Session documentation is currently a manual process.** There is no automatic trigger that creates session files when:

- Significant features are implemented
- Complex refactoring is completed
- Major bugs are investigated
- Architecture decisions are made

According to [CLAUDE.md](../CLAUDE.md), sessions should be created for:

- Research and analysis tasks
- Feature implementation notes
- Bug investigation documentation
- Architecture decisions
- Any work that might need future reference

However, **Claude (the AI) must be explicitly instructed or reminded to create these sessions.**

## Current State

### What IS Automatic

- ✅ Git commits are created and tracked
- ✅ CI/CD pipeline runs on push
- ✅ Pre-push hooks run tests
- ✅ Documentation is updated in commits
- ✅ TODO.md tracks progress

### What is NOT Automatic

- ❌ Session file creation
- ❌ Session metadata documentation
- ❌ Context preservation between conversations
- ❌ Decision log generation
- ❌ Architecture decision records (ADRs)

## Solution: Hybrid Approach

### Option 1: Manual Request (Current State)

**You explicitly ask Claude to create session documentation.**

**When to use:**

- At the end of a significant piece of work
- When completing a week milestone
- After solving a complex problem
- When you want to preserve context

**How to request:**

```
"Please create a session file documenting the work we just completed."
"Document this week's work in the output/sessions/ folder."
"Create a retrospective session for the blog feature implementation."
```

### Option 2: Proactive Claude Behavior (Ideal State)

**Claude automatically creates session documentation without being asked.**

**When Claude should create sessions automatically:**

1. **After completing multi-file feature work** (3+ files modified)
2. **After week milestones** (Week 5, Week 6, etc.)
3. **After architectural decisions** (layout refactor, schema changes)
4. **After bug investigation** (found root cause, implemented fix)
5. **Before switching to unrelated work** (context switch)

**Implementation:**
This requires Claude to be more proactive. The instructions in [CLAUDE.md](../CLAUDE.md) should emphasize this, but ultimately it depends on:

- Claude remembering to create sessions
- Clear indicators that work is "complete"
- User confirmation that work is done

### Option 3: Post-Commit Hook (Future Enhancement)

**Automatically detect when session-worthy work is complete.**

**Trigger conditions:**

- Commit message contains keywords: "feat:", "refactor:", "fix:" (major)
- Multiple files modified (>5 files)
- Week milestone commit (matches pattern in TODO.md)
- Merge to staging/main branches

**Implementation:**

```bash
# .husky/post-commit or .github/workflows/session-logger.yml

if [[ $COMMIT_MSG =~ ^(feat|refactor).*Week\ [0-9] ]]; then
  echo "⚠️  Week milestone detected. Consider creating a session file."
  echo "Run: claude 'Document this week's work in output/sessions/'"
fi
```

**Challenges:**

- Can't automatically generate session content (requires Claude)
- Would need to invoke Claude from git hook
- May interrupt workflow with prompts

## Recommended Workflow

### For You (User)

#### At the End of Major Work

When you complete significant work, explicitly ask Claude:

```
"We just completed Week 6 - blog and projects. Please create a comprehensive
session file documenting this work in output/sessions/, including decisions,
challenges, and lessons learned."
```

#### Weekly Milestone Pattern

At the end of each week:

```
"Create a Week [N] retrospective session file covering all work completed
this week."
```

#### After Complex Debugging

When you solve a tricky bug:

```
"Document this bug investigation in a session file - root cause, solution,
and prevention steps."
```

#### Context Preservation

Before ending a work session or switching projects:

```
"Create a session file for the current work so we can resume later with
full context."
```

### For Claude (AI)

#### Proactive Triggers

Claude should automatically offer to create sessions when:

1. **Week milestone commit detected**

   ```
   "I notice we just completed Week 6. Should I create a retrospective
   session file documenting this week's work?"
   ```

2. **Major feature complete**

   ```
   "The blog system is now complete. I'll create a session file documenting
   the implementation, decisions, and lessons learned."
   ```

3. **Before context switch**

   ```
   "Before we move to the registry work, let me document the current state
   in a session file for future reference."
   ```

4. **After architectural decision**
   ```
   "I've documented the single-column layout decision in a session file
   since this affects future content types."
   ```

## Session File Checklist

When creating session files, ensure they include:

### Required Fields

- [ ] **Title** - Clear, descriptive session name
- [ ] **Start/End Dates** - When work was performed
- [ ] **Status** - Active, Completed, or Archived
- [ ] **Objective** - What was the goal?

### Key Content

- [ ] **Summary** - 2-3 paragraph overview
- [ ] **Key Deliverables** - What was built/fixed/changed
- [ ] **Key Decisions** - Why certain approaches were chosen
- [ ] **Files Modified** - List of changed files with descriptions
- [ ] **Technical Details** - Implementation specifics
- [ ] **Testing Results** - What was tested and how
- [ ] **Lessons Learned** - What worked, what didn't
- [ ] **Next Steps** - What comes next

### Optional but Valuable

- [ ] **Code snippets** - Key implementation examples
- [ ] **Diagrams** - Architecture or flow diagrams
- [ ] **Metrics** - Performance, build times, costs
- [ ] **Related commits** - Git commit references
- [ ] **Documentation links** - Related docs

## Examples of Good Session Files

### Comprehensive Feature Documentation

See: `output/sessions/2026-01-25_ai-content-generation-week5.md`

- Complete feature overview
- All deliverables documented
- Key decisions with rationale
- Testing results and metrics
- Cost analysis
- Lessons learned

### Refactoring Documentation

See: `output/sessions/2026-01-26_article-layout-standardization.md`

- Before/after comparison
- Design decisions explained
- Performance impact measured
- Challenges and solutions
- Future improvements

### Configuration Documentation

See: `output/sessions/2026-01-24_production-domain-configuration.md`

- Technical details (DNS, SSL)
- Deployment workflow
- Testing verification
- Related commits

## Integration with Existing Tools

### Git Workflow

Session creation should fit into existing workflow:

```bash
# 1. Complete work on feature branch
git add .
git commit -m "feat: Add blog system"

# 2. CREATE SESSION (manual or prompted by Claude)
# output/sessions/YYYY-MM-DD_blog-system.md created

# 3. Commit session file
git add output/sessions/
git commit -m "docs: Add blog system session documentation"

# 4. Continue with merge workflow
git checkout staging
git merge develop
```

### TODO.md Integration

Session files complement TODO.md:

- **TODO.md** - High-level progress tracking
- **Session files** - Detailed implementation notes

When updating TODO.md with completed items, consider whether a session file is warranted.

### CHANGELOG.md Integration

Session files provide source material for CHANGELOG.md:

- CHANGELOG.md - User-facing changes
- Session files - Developer-facing details

## Automation Opportunities (Future)

### 1. Session Template Generator

```bash
# tools/create-session.ts
pnpm session:create "blog-system" --type feature
# Generates template in output/sessions/YYYY-MM-DD_blog-system.md
```

### 2. Session Metadata Extractor

```bash
# Extract metadata from recent commits
pnpm session:extract --since "2026-01-20" --output "week6-session.md"
# Parses commits, files changed, generates skeleton
```

### 3. Claude Integration Script

```bash
# Invoke Claude to create session
pnpm session:document "Week 6 blog system"
# Calls Claude API with context, generates session file
```

### 4. Session Index Generator

```bash
# Generate index of all sessions
pnpm session:index
# Creates output/sessions/INDEX.md with all sessions
```

## FAQ

### Q: Should every commit have a session file?

**A:** No. Session files are for significant work only:

- Major features (3+ files, new functionality)
- Complex refactoring (architectural changes)
- Bug investigations (non-trivial debugging)
- Week milestones (Week 5, Week 6, etc.)

Small fixes, typos, and minor updates don't need sessions.

### Q: What if I forget to create a session?

**A:** You can create retrospective sessions anytime:

```
"Create a retrospective session file for the Week 6 work we completed
last week, based on the git commits and TODO.md updates."
```

### Q: How long should session files be?

**A:** As long as needed to capture important context:

- **Minimum:** ~100-200 lines (basic documentation)
- **Typical:** ~300-500 lines (comprehensive documentation)
- **Detailed:** ~800+ lines (complex features with examples)

### Q: Should sessions be in git?

**A:** Yes, in `output/sessions/` (tracked in git).

- Preserves team knowledge
- Enables future reference
- Documents decision history
- Supports onboarding

### Q: Can I edit sessions later?

**A:** Absolutely. Sessions are living documents:

- Add "Update" sections with new learnings
- Link to follow-up work
- Correct mistakes or add missing context

## Action Items

### Immediate (You)

1. ✅ Request retrospective sessions for recent work (Done - 4 sessions created)
2. [ ] Review created sessions for completeness
3. [ ] Commit session files to git
4. [ ] Update .current-session pointer

### Short-term (Next 2 weeks)

1. [ ] Establish habit of requesting sessions after major work
2. [ ] Add session creation to weekly workflow
3. [ ] Create session index in output/sessions/INDEX.md
4. [ ] Update CLAUDE.md with session creation emphasis

### Future Enhancements

1. [ ] Build session template generator (tools/create-session.ts)
2. [ ] Create session metadata extractor
3. [ ] Add post-commit hook reminder
4. [ ] Build session index generator
5. [ ] Integrate with project management tools

## Conclusion

**Session documentation is currently manual but should become habitual.**

The best approach is a **hybrid model**:

1. **You** remember to ask for sessions after major work
2. **Claude** proactively offers to create sessions when appropriate
3. **Future automation** provides templates and reminders

The key is recognizing when work is "session-worthy":

- ✅ Major features, refactoring, architecture changes
- ✅ Week milestones, complex debugging, important decisions
- ❌ Small fixes, typos, minor updates

With this system, the platform will have comprehensive documentation of its evolution, making it easier to understand decisions, onboard new developers, and avoid repeating past mistakes.
