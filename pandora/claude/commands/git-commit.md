---
description: Smart git commit workflow with context-aware staging and message generation
argument-hint: "[--quick|--full|--retry] [--no-edit] [--type=<type>] [--scope=<scope>] [--profile=<name>]"
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git add:*), Bash(git commit:*), Bash(pre-commit:*), Bash(echo:*), Bash(xargs:*), Read(*), Edit(*), MultiEdit(*), Write(*)
---

# Smart Git Commit Workflow

Execute an intelligent git commit workflow that follows all safety rules from CLAUDE.md while streamlining the commit process.

## Command: `/git:commit $ARGUMENTS`

### Workflow Implementation

0. **SAFETY CHECK**: Verify @CLAUDE.md exists and read it
   - Verify @CLAUDE.md exists at project root
   - Read and internalize commit safety rules:
     - NEVER commit without explicit user request
     - NEVER use `git add -A` or `git add .`
     - NEVER use --no-verify
     - Always run appropriate linters before committing

1. **CONSTRAINT CHECK**: Verify safe commit state
   - Confirm this is an explicit commit request (not "let's commit")
   - Check no merge/rebase in progress
   - Verify user is aware of all changes being committed

2. **Initial Status Check**
   After safety checks, gather comprehensive information about the current state:

   ```bash
   \! git status && git diff HEAD && git log -n 3 --oneline
   ```

3. **Analyze Changes & Arguments**
   - Parse arguments: `$ARGUMENTS`
   - Handle natural language requests (e.g., "unstage the docs/" -> `git restore --staged docs/`)
   - Process flags: --quick, --full, --type, --scope, etc.
   - Determine complexity: If <5 files changed, use quick mode; otherwise full mode
   - Override mode if --quick or --full specified

4. **Smart File Staging**
   Based on git history patterns, intelligently group and stage related files:

   **File Grouping Patterns** (learned from project):
   - Python files with their tests: `*.py` + `tests/test_*.py`
   - Documentation with implementation: `*.md` + related code files
   - Config files together: `*.yaml`, `*.yml`, `*.toml`, `*.json`
   - Frontend components: `*.tsx` + `*.css` + tests

   **Path-based Type Inference**: Automatically infer type from file paths (tests -> test, docs -> docs, etc.)

   **CRITICAL**: NEVER use `git add -A` or `git add .`
   Always stage specific files or patterns only.

   Show files to be staged and get confirmation before proceeding.

5. **Generate Commit Message**
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

6. **Pre-commit Check Handling**

   **Known Failure Patterns & Fixes**:
   - Markdown line length in decision logs -> Exclude from linting
   - Import sorting issues -> Auto-fix with `uv run ruff --fix`
   - Trailing whitespace -> Auto-fix
   - YAML formatting -> Auto-fix with taplo
   - Deprecated linter rules -> Remove from config before commit

   **Smart Retry Logic**:
   - If pre-commit fails, analyze error
   - Apply known fixes if pattern matches
   - Re-run pre-commit after fixes
   - NEVER use --no-verify

   Run pre-commit proactively when risky patterns detected:

   ```bash
   \! pre-commit run --files <staged-files>
   ```

7. **Commit Message Finalization**

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

8. **Error Recovery**
   If commit fails:
   - Save state for --retry option
   - Analyze failure reason
   - Suggest fixes without bypassing checks
   - Learn from failure for future commits

## Mode Selection

- **Quick Mode** (--quick or <5 files): Minimal output, fast staging, no interactive editing by default
- **Full Mode** (--full or complex): Detailed analysis, full pre-commit, interactive editing by default  
- **Smart Mode** (default): Auto-selects based on complexity
- **Editing**: Use --edit to force or --no-edit to skip interactive message editing

## User Preferences

Track and learn from user behavior: file groupings, commit types, message styles, and editing preferences.

## Safety Rules

MANDATORY requirements from CLAUDE.md:

- [x] NEVER commit without explicit user request
- [x] "Let's X" means "let's discuss X" - NOT "do X now"
- [x] NEVER use `git add -A` or `git add .`
- [x] NEVER use --no-verify
- [x] Always run `git status` first
- [x] Propose draft message, don't ask for it
- [x] Keep messages concise
- [x] No emojis in commits
- [x] No AI attribution in messages
- [x] Fix issues instead of bypassing

## Examples

```bash
# Auto-detect mode based on complexity
/git:commit

# Mode control
/git:commit --quick                        # Simple changes
/git:commit --full                         # Complex changes

# Specify commit type and scope
/git:commit --type=feat --scope=server
/git:commit --type=fix

# Message editing control
/git:commit --edit                         # Force interactive editing
/git:commit --no-edit                      # Skip interactive editing

# Common combinations
/git:commit --quick --type=chore
/git:commit --retry                        # After fixing pre-commit issues
```

## Pre-commit Workflow

### Critical Pre-commit Process

After staging files, ALWAYS follow this iterative validation process:

1. **Run pre-commit checks** on staged files:

   ```bash
   ! pre-commit run --files <staged-files>
   ```

2. **Handle results**:
   - If passes -> Proceed to commit
   - If auto-fixes files -> Stage the fixed files and return to step 1
   - If fails with errors -> Attempt known fixes and return to step 1

3. **Iterative fixing**:
   - Continue the cycle: stage -> pre-commit -> fix -> stage
   - Each iteration should make progress toward passing
   - Maximum 5 iterations to prevent infinite loops

4. **Loop detection**:
   - If the same error occurs 3 times -> Request user intervention
   - Track error patterns to detect cycles
   - Break loop and explain the blocking issue clearly

**IMPORTANT**: Never proceed to commit until pre-commit passes completely. This ensures code quality and prevents commit
failures.

## Common Pre-commit Fixes

- **Auto-fixable**: Trailing whitespace, import sorting, YAML/JSON formatting, line endings
- **Manual fixes**: Type errors, test failures, large files, merge conflicts

## Handling Conflicts

When staging would conflict with existing staged files:

1. **Assess current state**: `git status`
2. **Offer resolution options**:
   - Unstage existing and restage all (comprehensive commit)
   - Add to existing staging (incremental approach)
   - Skip conflicting files (partial commit)
   - Abort and request manual resolution

3. **Smart conflict resolution**:
   - If files are related -> Suggest combining
   - If files are unrelated -> Suggest separate commits (use `git restore --staged` to unstage)
   - If unsure -> Ask for user preference
   - Respect user's separation of concerns (e.g., config vs docs)

## Message Templates

Follow conventional commit format:

- `feat(<scope>): add <what>` - New features
- `fix(<scope>): prevent <issue>` - Bug fixes  
- `docs: update <what>` - Documentation
- `refactor(<scope>): <what>` - Code restructuring
- `chore: <action> <target>` - Maintenance

## Pattern Learning

**Learning** means capturing user preferences from repeated actions or explicit requests (things they asked you to do or not do).

The command learns from:

1. **User corrections**: When user modifies your suggestions, that's a preference
2. **Explicit requests**: "Always do X" or "Never do Y"
3. **Repeated patterns**: Same action taken 3+ times indicates preference
4. **Rejected suggestions**: When user consistently avoids certain approaches

Save learnings to CLAUDE.md's "Slash Commands" section when you identify:

- Repeated user corrections to the same type of suggestion
- Explicit "always" or "never" instructions from the user
- Consistent file grouping preferences across multiple commits
- Specific commit message styles the user prefers

**Important**: Update or clarify existing patterns in CLAUDE.md's "Slash Commands" section rather than duplicating. Focus on user preferences, not general patterns.

## Edge Cases

- **Empty repository**: Suggest `feat: initial commit`
- **Binary files**: Warn about large files (>1MB), suggest Git LFS
- **Merge in progress**: Detect and guide through resolution
- **No changes**: Show status and suggest next steps

## Command Integration

Works seamlessly with other slash commands:

### Workflow Examples

```bash
# After design discussion
/claude-discuss feature-design
# ... discussion completes ...
/git-commit --type=docs --scope=decisions

# After implementation
/claude-think  # Review guidelines
/git-commit --type=feat --scope=server

# Quick fixes
/git-commit --quick --type=fix
```

### Chain Operations

- Post-discussion -> Commit decision logs
- Pre-PR -> Ensure clean commit history
- Post-refactor -> Organized commits

## Performance Optimizations

- Use `git status --porcelain` for faster parsing
- Cache recent patterns and batch operations
- Show progress for long operations
- Use glob patterns for many files

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
