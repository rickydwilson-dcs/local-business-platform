# Update Documentation

Update documentation files to reflect the current state of the repository. This command scans the codebase and updates key documentation files.

## Tasks

1. **Update docs/README.md** with current statistics:
   - Count standards files in `docs/standards/`
   - Count guide files in `docs/guides/`
   - Count MDX files in `sites/colossus-reference/content/`
   - Update site page counts

2. **Update CHANGELOG.md** with recent commits:
   - Scan git log for conventional commits since last update
   - Add new entries following the existing format
   - Group by type (feat, fix, docs, etc.)

3. **Verify cross-references**:
   - Check that links in standards files are valid
   - Check that links in guides files are valid
   - Report any broken links

## Execution Steps

### Step 1: Gather Statistics

```bash
# Count standards files
ls docs/standards/*.md | wc -l

# Count guide files
ls docs/guides/*.md | wc -l

# Count service MDX files
ls sites/colossus-reference/content/services/*.mdx | wc -l

# Count location MDX files
ls sites/colossus-reference/content/locations/*.mdx | wc -l
```

### Step 2: Check Recent Commits

```bash
# Get commits since last documentation update
git log --oneline --since="1 week ago" --pretty=format:"%h %s"
```

### Step 3: Update Files

Update these files with current information:

- `docs/README.md` - Statistics and navigation
- `CHANGELOG.md` - New commit entries (if any significant changes)

### Step 4: Report Status

Report what was updated:

- Number of standards files
- Number of guide files
- Number of content files (services + locations)
- Any new commits added to CHANGELOG
- Any broken links found

## Notes

- This command is designed for the local-business-platform repository
- Run before commits to ensure documentation is current
- Focus on accuracy over completeness
