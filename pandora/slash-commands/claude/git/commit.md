---
description: Smart git commit workflow with context-aware staging and message generation
argument-hint: "[--quick|--full|--retry] [--no-edit] [--type=<type>] [--scope=<scope>] [--profile=<name>]"
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*), Bash(pre-commit:*), Read(*), Edit(*), MultiEdit(*), Write(*)
---

# Smart Git Commit Workflow

Execute an intelligent git commit workflow that follows all safety rules from CLAUDE.md while streamlining the commit process.

## Command: `/git:commit $ARGUMENTS`

### Workflow Implementation

1. **Initial Status Check**
   First, gather comprehensive information about the current state:
   ```bash
   \! git status && git diff HEAD && git log -n 3 --oneline
   ```

2. **Analyze Changes & Arguments**
   - Parse arguments: `$ARGUMENTS`
   - Handle natural language requests (e.g., "unstage the docs/" → `git restore --staged docs/`)
   - Process flags: --quick, --full, --type, --scope, etc.
   - Determine complexity: If <5 files changed, use quick mode; otherwise full mode
   - Override mode if --quick or --full specified

3. **Smart File Staging**
   Based on git history patterns, intelligently group and stage related files:

   **File Grouping Patterns** (learned from project):
   - Python files with their tests: `*.py` + `tests/test_*.py`
   - Documentation with implementation: `*.md` + related code files
   - Config files together: `*.yaml`, `*.yml`, `*.toml`, `*.json`
   - Frontend components: `*.tsx` + `*.css` + tests

   **Path-based Type Inference**:
   - `src/nl2sciviz/server/` → feat
   - `src/nl2sciviz/client/` → feat
   - `tests/` → test
   - `docs/` → docs
   - `.github/`, `scripts/` → chore
   - `*.md` files → docs (unless with code changes)

   **CRITICAL**: NEVER use `git add -A` or `git add .`
   Always stage specific files or patterns only.

   Show files to be staged and get confirmation before proceeding.

4. **Generate Commit Message**
   Analyze changes to create appropriate commit message:

   **Message Generation Strategy**:
   - Analyze diff for primary change type
   - Check file paths for conventional scope
   - Review recent commits for style consistency
   - Keep message concise (under 72 chars)
   - Use present tense, no period

   **Type Selection Priority**:
   1. Explicit --type argument
   2. Path-based inference
   3. Diff content analysis
   4. Default to most significant change

5. **Pre-commit Check Handling**

   **Known Failure Patterns & Fixes**:
   - Markdown line length in decision logs → Exclude from linting
   - Import sorting issues → Auto-fix with `uv run ruff --fix`
   - Trailing whitespace → Auto-fix
   - YAML formatting → Auto-fix with taplo
   - Deprecated linter rules → Remove from config before commit

   **Smart Retry Logic**:
   - If pre-commit fails, analyze error
   - Apply known fixes if pattern matches
   - Re-run pre-commit after fixes
   - NEVER use --no-verify

   Run pre-commit proactively when risky patterns detected:
   ```bash
   \! pre-commit run --files <staged-files>
   ```

6. **Commit Message Finalization**

   **Interactive Mode (default for full mode, optional for others)**:
   - Generate draft message based on analysis
   - Create temporary file `.git/COMMIT_EDITMSG_DRAFT.md`
   - Write draft message to file
   - Open in IDE for user editing:
     ```bash
     \! echo "<generated-message>" > .git/COMMIT_EDITMSG_DRAFT.md
     ```
   - Display: "Please review and edit the commit message in your IDE"
   - Wait for user to save and confirm
   - Read final message from file

   **Quick Mode (--no-edit flag)**:
   - Use generated message directly without editing
   - Suitable for simple, obvious changes

   **Execute Commit**:
   ```bash
   \! git commit -m "<final-message>"
   ```

   Or for interactive editing:
   ```bash
   \! git commit -F .git/COMMIT_EDITMSG_DRAFT.md
   ```

   Then verify success:
   ```bash
   \! git status
   ```

7. **Error Recovery**
   If commit fails:
   - Save state for --retry option
   - Analyze failure reason
   - Suggest fixes without bypassing checks
   - Learn from failure for future commits

## Mode Selection

**Quick Mode** (--quick or <5 files):
- Minimal output
- Fast staging of obvious groups
- Simple commit message
- Skip detailed analysis
- No interactive editing by default (use --edit to enable)

**Full Mode** (--full or complex changes):
- Detailed change analysis
- Careful file grouping
- Comprehensive message generation
- Full pre-commit checks
- Interactive message editing by default (use --no-edit to skip)

**Smart Mode** (default):
- Automatically choose based on:
  - Number of files changed
  - Presence of test files
  - Mix of file types
  - Recent failure patterns
- Interactive editing for complex changes (>5 files)

**Message Editing Control**:
- `--edit`: Force interactive message editing (opens in IDE)
- `--no-edit`: Skip interactive editing, use generated message
- Default: Quick mode skips, Full mode enables editing

## User Preferences

Track and learn from user behavior:
- Verbosity level (minimal/normal/verbose)
- Auto-fix preference
- Common file groupings
- Frequent commit types
- Message style preferences
- Interactive editing preference (always/never/smart)
- IDE integration preferences

## Safety Rules

MANDATORY requirements from CLAUDE.md:
- ✅ NEVER use `git add -A` or `git add .`
- ✅ NEVER use --no-verify
- ✅ Always run `git status` first
- ✅ Propose draft message, don't ask for it
- ✅ Keep messages concise
- ✅ No emojis in commits
- ✅ No AI attribution in messages
- ✅ Fix issues instead of bypassing

## Examples

```bash
# Smart mode (auto-detect based on complexity)
/git:commit

# Quick mode for simple changes
/git:commit --quick

# Full analysis for complex changes
/git:commit --full

# Specify commit type
/git:commit --type=feat
/git:commit --type=fix --scope=server

# Retry after fixing pre-commit issues
/git:commit --retry

# Use saved profile for common patterns
/git:commit --profile=docs
/git:commit --profile=refactor

# Combine options
/git:commit --quick --type=chore
/git:commit --full --type=feat --scope=client

# Interactive message editing control
/git:commit --edit                         # Force interactive editing
/git:commit --no-edit                      # Skip interactive editing
/git:commit --quick --edit                 # Quick mode with editing
/git:commit --full --no-edit               # Full mode without editing

# More examples with different scenarios
/git:commit --type=docs                    # Documentation changes
/git:commit --type=test --scope=unit       # Test additions
/git:commit --type=refactor --quick        # Quick refactoring
/git:commit --type=chore --scope=deps      # Dependency updates
/git:commit --profile=hotfix --quick       # Quick hotfix using profile
/git:commit --no-edit --type=fix           # Quick fix without editing
```

## Pre-commit Workflow

### Critical Pre-commit Process

After staging files, ALWAYS follow this iterative validation process:

1. **Run pre-commit checks** on staged files:
   ```bash
   ! pre-commit run --files <staged-files>
   ```

2. **Handle results**:
   - If passes → Proceed to commit
   - If auto-fixes files → Stage the fixed files and return to step 1
   - If fails with errors → Attempt known fixes and return to step 1

3. **Iterative fixing**:
   - Continue the cycle: stage → pre-commit → fix → stage
   - Each iteration should make progress toward passing
   - Maximum 5 iterations to prevent infinite loops

4. **Loop detection**:
   - If the same error occurs 3 times → Request user intervention
   - Track error patterns to detect cycles
   - Break loop and explain the blocking issue clearly

**IMPORTANT**: Never proceed to commit until pre-commit passes completely. This ensures code quality and prevents commit failures.

## Common Pre-commit Failures & Fixes

### Automated Fixes
These issues can be auto-fixed before retry:
- **Trailing whitespace**: Auto-fix with pre-commit
- **Import sorting (Python)**: `ruff --fix`
- **YAML formatting**: `taplo format`
- **JSON formatting**: Auto-fix with pre-commit
- **End of file**: Auto-fix with pre-commit
- **Line endings**: Auto-fix to LF

### Manual Intervention Required
These need user attention:
- **Type errors (mypy)**: Review and fix type annotations
- **Test failures**: Fix broken tests before committing
- **Large files (>1MB)**: Consider using Git LFS or excluding
- **Merge conflicts**: Resolve before committing
- **Markdown line length in decision logs**: May need exclusion

## Project-Specific Patterns (NL2SciViz)

### File Groupings
- Server changes: `src/nl2sciviz/server/*.py` + corresponding tests + configs
- Client changes: `src/nl2sciviz/client/*.py` + interfaces
- Agent changes: `agents/*/` + `agents/common/` utilities
- Benchmark changes: Query examples + evaluation metrics + scoring
- Documentation: `*.md` + related implementation files
- Config updates: All `*.yaml`, `*.toml`, `*.json` together

### Common Commit Patterns
- Adding queries: `feat: add <difficulty> queries for <technique>`
- Metrics update: `feat: implement <metric> for <mode> evaluation`
- Agent improvements: `feat(agent): enhance <agent> <capability>`
- Benchmark fixes: `fix: correct scoring for <scenario>`
- Documentation: `docs: update <component> documentation`
- POC implementation: `feat: implement POC V2 <component>`

## Handling Conflicts

When staging would conflict with existing staged files:

1. **Assess current state**: `git status`
2. **Offer resolution options**:
   - Unstage existing and restage all (comprehensive commit)
   - Add to existing staging (incremental approach)
   - Skip conflicting files (partial commit)
   - Abort and request manual resolution

3. **Smart conflict resolution**:
   - If files are related → Suggest combining
   - If files are unrelated → Suggest separate commits (use `git restore --staged` to unstage)
   - If unsure → Ask for user preference
   - Respect user's separation of concerns (e.g., config vs docs)

## Message Templates

### Feature Addition
```
feat(<scope>): add <what>

Implements <functionality> to enable <benefit>
```

### Bug Fix
```
fix(<scope>): prevent <issue>

Resolves <problem> by <solution>
```

### Documentation
```
docs: update <what> for <why>
```

### Refactoring
```
refactor(<scope>): extract <what> into <where>

Improves <metric> by <approach>
```

### Chore/Maintenance
```
chore: <action> <target>

<Optional details if non-obvious>
```

## Pattern Learning

The command learns from:

1. **Successful commits**: File groupings that consistently work
2. **Failed attempts**: Pre-commit patterns to proactively handle
3. **User corrections**: Modified staging or messages indicate preferences
4. **Frequency analysis**: Common commit types per directory

Updates stored in CLAUDE.md after:
- 5 similar successful groupings → New file pattern
- 3 similar failures → New known issue pattern
- User override of suggestion → Preference update
- Repeated commit types in directory → Path-type association
- User requests (e.g., unstaging) → Learn separation preferences

**Important**: When discovering significant patterns or preferences through user interactions,
update this command file (~/.claude/commands/git/commit.md) with the new insights. This ensures
the command evolves and improves based on actual usage patterns rather than keeping learnings
isolated to individual sessions.

## Edge Cases

### Empty Repository
- Initialize with sensible defaults
- Suggest `feat: initial commit` or similar
- Stage foundational files (README, .gitignore, etc.)

### No Changes
- Inform user nothing to commit
- Run `git status` to show current state
- Suggest checking unstaged changes

### Binary Files
- Warn about large binaries (>1MB)
- Suggest .gitignore additions if appropriate
- Recommend Git LFS for media/data files
- Never auto-stage without confirmation

### Submodules
- Handle submodule changes separately
- Warn about uncommitted submodule changes
- Suggest updating submodules first if needed

### Merge in Progress
- Detect merge/rebase state
- Guide through conflict resolution
- Ensure merge completion before new commits

## Command Integration

Works seamlessly with other slash commands:

### Workflow Examples
```bash
# After design discussion
/claude:discuss feature-design
# ... discussion completes ...
/git:commit --type=docs --scope=decisions

# After implementation
/claude:think  # Review guidelines
/git:commit --type=feat --scope=server

# Quick fixes
/git:commit --quick --type=fix
```

### Chain Operations
- Post-discussion → Commit decision logs
- Pre-PR → Ensure clean commit history
- Post-refactor → Organized commits

## Performance Optimizations

### Large Repositories
- Use `git status --porcelain` for faster parsing
- Cache recent commit analysis (5 minute TTL)
- Limit history scan to last 20 commits
- Batch file operations when possible

### Many Files (>20)
- Group by directory first for overview
- Show summary before detailed staging
- Use glob patterns over individual files
- Offer "stage all in directory" option

### Slow Operations
- Show progress indicators for long operations
- Run analysis in parallel where possible
- Skip expensive checks in quick mode
- Cache learned patterns in memory

## Implementation Notes

When processing this command:
1. Read CLAUDE.md for project-specific rules
2. Check git status before any operations
3. Run pre-commit iteratively until success
4. Learn from git history for patterns
5. Update patterns based on success/failure
6. Maintain safety rules absolutely
7. Provide clear, concise output
8. Focus on efficiency without compromising safety
9. Break loops and ask for help when stuck
