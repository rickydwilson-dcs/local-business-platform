# Output Folder

This folder stores session artifacts, context, and documentation. The `sessions/` subfolder is **tracked in git** for team visibility, while other contents (generated images, batch files) remain **gitignored**.

## Purpose

The output folder serves three core functions:

1. **Session Context** - Persistent storage of Claude conversation context, metadata, and state between sessions
2. **Local Documentation** - Work-in-progress notes, analysis, and decision logs specific to your local environment
3. **Temporary Artifacts** - Build outputs, logs, and development artifacts for local debugging without cluttering the repo

## Directory Structure

```
output/
├── README.md                          # This file
├── .current-session                   # Pointer to active session folder
├── 2025-12-06_planning-features/      # Example session
│   ├── session.md                     # Session metadata and notes
│   ├── context.json                   # Conversation context (Claude memory)
│   ├── notes.md                       # Working notes and decisions
│   └── artifacts/                     # Generated files, drafts, logs
│       ├── architecture-notes.md
│       ├── component-analysis.json
│       └── build-logs/
│
└── 2025-11-30_refactor-components/    # Archived session
    └── ...
```

## Session Naming Convention

Sessions use the format: `YYYY-MM-DD_topic-description`

**Examples:**

- `2025-12-06_planning-features` - Feature planning session on Dec 6
- `2025-12-01_security-audit` - Security audit from Dec 1
- `2025-11-28_component-refactor` - Component refactoring from Nov 28

**Guidelines:**

- Use kebab-case for the topic description (lowercase, hyphens between words)
- Keep descriptions concise (2-4 words)
- Date ensures chronological sorting and prevents collisions

## Creating a New Session

### Step 1: Create the folder

```bash
mkdir -p output/YYYY-MM-DD_topic-description
```

### Step 2: Copy the metadata template

Create `session.md` in your new folder:

```markdown
# Session: YYYY-MM-DD_topic-description

**Start Date:** YYYY-MM-DD
**Status:** Active / Completed
**Objective:** Clear description of session goal

## Summary

Brief overview of work completed or planned.

## Key Decisions

- Decision 1 and rationale
- Decision 2 and rationale

## Files Modified

- `path/to/file.ts` - brief change description
- `path/to/file.md` - brief change description

## Next Steps

- [ ] Task 1
- [ ] Task 2

## Notes

Any additional context or learnings.
```

### Step 3: Update the .current-session pointer

```bash
echo "2025-12-06_topic-description" > output/.current-session
```

### Step 4: Create subdirectories as needed

```bash
mkdir -p output/YYYY-MM-DD_topic-description/artifacts
```

## Using the .current-session Pointer

The `.current-session` file stores the name of your currently active session folder.

**Check current session:**

```bash
cat output/.current-session
```

**Switch to a different session:**

```bash
echo "2025-12-01_other-session" > output/.current-session
```

This allows you and Claude to quickly identify which session folder to write to or read from.

## Session File Types

### session.md

Metadata and status file for the session. Contains:

- Session objective and date range
- Current status
- Summary of work completed
- Key decisions made
- List of modified files
- Next steps and outstanding tasks
- General notes and learnings

### context.json

Claude conversation context exported for persistence across sessions:

```json
{
  "session": "2025-12-06_planning-features",
  "exported": "2025-12-06T15:30:00Z",
  "context": {
    "objective": "Plan H2 2025 features",
    "completed_tasks": ["Architecture review", "Stakeholder interviews"],
    "active_tasks": ["Feature prioritization"],
    "decisions": ["Use RFC process for major features"]
  }
}
```

### notes.md

Unstructured working notes and learnings:

- Analysis findings
- Design decisions and trade-offs
- Debugging observations
- Code patterns discovered
- Questions for follow-up

### artifacts/

Generated files and outputs:

- Build logs and error traces
- Component analysis or architecture diagrams
- Draft documentation
- Test results
- Temporary generated code samples
- Performance profiles

## Example Session Structure

```
output/2025-12-06_planning-features/
├── session.md
│   - Title: "Q4 2025 Feature Planning"
│   - Objective: Prioritize and scope features for staging
│   - Status: Active
│   - Files modified: ARCHITECTURE.md, docs/roadmap.md
│
├── context.json
│   - Tracks conversation state for next session
│   - Exports key decisions for continuity
│
├── notes.md
│   - "White-label customization: High value, 5pt estimate"
│   - "Analytics dashboard: Dependent on SDK completion"
│   - "Considered: Custom MDX components vs. built-in"
│
└── artifacts/
    ├── feature-matrix.md
    │   - Comparison of 12 proposed features
    │   - Scoring matrix (RICE framework)
    │
    ├── architecture-impact.md
    │   - How each feature affects system architecture
    │   - Risk assessment
    │
    └── build-logs/
        ├── type-check-2025-12-06.log
        └── test-results-2025-12-06.json
```

## Archiving Old Sessions

When a session is complete or no longer needed:

1. **Update session.md status:**

   ```markdown
   **Status:** Archived
   **Archived:** YYYY-MM-DD
   **Archive Reason:** Feature completed and merged to main
   ```

2. **Create an archive folder (optional):**

   ```bash
   mkdir -p output/archive
   mv output/2025-11-15_old-session output/archive/
   ```

3. **Keep important learnings:**
   - Extract key decisions from notes.md
   - Document any patterns discovered
   - Reference in current session notes for continuity

**Retention:**

- Keep completed sessions for 2-3 months
- Archive sessions after 1 month of inactivity
- Delete when historical context is no longer valuable

## Git Tracking

The `sessions/` folder is **tracked in git** and committed to the repository. Other contents remain gitignored.

**What's tracked:**

- `sessions/` - All session folders and their contents (analysis, audits, research)
- `README.md` - This documentation file

**What's gitignored:**

- `generated-images/` - Temporary image processing outputs
- `batch-*.json*` - Batch processing artifacts

**Why track sessions:**

- Preserves valuable research, audits, and analysis for future reference
- Enables team collaboration on complex investigations
- Creates a historical record of decisions and findings

**For sensitive or personal notes:**

- Use a separate local folder outside the repository
- Or add specific files to `.gitignore` if needed

## Common Workflows

### Start a new planning session

```bash
mkdir -p output/2025-12-06_planning-next-feature/artifacts
echo "2025-12-06_planning-next-feature" > output/.current-session
# Create session.md with objective
```

### Export conversation context between sessions

```bash
# At end of current session, save context
jq '{session, exported: now, context}' > output/2025-12-06_planning/context.json

# At start of new session, restore context
cat output/2025-12-06_planning/context.json | jq .context
```

### Document important findings

```bash
# During session, keep notes in artifacts/
vim output/$(cat output/.current-session)/notes.md

# After session, move important notes to persistent docs
# e.g., findings → docs/guides/new-pattern.md
```

### Track build issues across sessions

```bash
# Save build logs with timestamp
npm run build 2>&1 | tee output/$(cat output/.current-session)/artifacts/build-$(date +%Y-%m-%d).log
```

## Quick Reference

| Task                 | Command                                             |
| -------------------- | --------------------------------------------------- |
| Create new session   | `mkdir -p output/YYYY-MM-DD_topic/artifacts`        |
| Set active session   | `echo "YYYY-MM-DD_topic" > output/.current-session` |
| View current session | `cat output/.current-session`                       |
| List all sessions    | `ls -d output/[0-9]*/ \| sort -r`                   |
| Archive session      | `mv output/YYYY-MM-DD_topic output/archive/`        |

## Notes

- The output folder structure is flexible—adapt it to your workflow
- Session names are unique, but you can have multiple active sessions if needed
- Update session.md regularly to capture progress and decisions
- Move important findings to persistent documentation (docs/ folder)
- This folder is ideal for ephemeral work and conversation context
