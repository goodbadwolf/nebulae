# Git Guidelines

Git workflow conventions and pre-commit setup

## Git Commit Guidelines

When making commits in this repository, follow these simple conventions:

### Commit Message Format

```text
<type>: <description>

<optional body>
```

### Types

Choose the type that best represents the primary purpose of your change.

- `feat` - New features or functionality
- `fix` - Bug fixes
- `docs` - Documentation changes only
- `refactor` - Code restructuring without changing behavior
- `test` - Adding or fixing tests
- `chore` - Maintenance tasks (dependencies, config, etc.)

### Guidelines

- Keep the first line under 72 characters
- Use present tense ("Add feature" not "Added feature")
- Don't capitalize the first letter after the type
- Don't end with a period
- Make small, frequent commits rather than large, infrequent ones
- Each commit should represent one logical change
- If a commit does multiple things, consider splitting into separate commits
- If you must combine changes, use the most important type and keep the description focused on the primary change
- Keep commit messages concise - if the title clearly explains the change,
  skip redundant bullet points
- Don't explain what's obvious from the diff (e.g., "uncommented X" when
  diff shows commented lines becoming uncommented)
- Focus on the "why" rather than the "what" when adding details
- Use precise, technical verbs: for example "harden" (for
  security/robustness improvements) over generic "improve"

### Examples

```text
feat: add server-side push events for real-time sync
fix: prevent duplicate tab creation on fast clicks
docs: update installation instructions for macOS
refactor: extract sync logic into separate module
test: add integration tests for tab merging
chore: update dependencies to latest versions
```

### When in doubt

- Focus on clarity over convention
- A clear message without a type is better than a confusing typed message
- For mixed changes, pick the primary purpose
- Don't stress about edge cases - just be consistent

### Staging Changes Selectively

When you have multiple unrelated changes in your working directory:

```bash
# Stage specific hunks interactively
git add -p <file>

# Stage entire files selectively
git add <file1> <file2>

# Review what's staged before committing
git diff --cached
```

Use `git add -p` (patch mode) to:

- Stage only specific parts of a file
- Split large changes into logical commits
- Keep commits focused on one change

## Pre-commit Hooks

This repository uses the [pre-commit](https://pre-commit.com/) framework to ensure code quality. The hooks run various linters and formatters before each commit.

### Features

- **Auto-formatting**: Automatically fixes many issues (formatting, import ordering)
- **Multi-language Support**: TypeScript, Rust, Python, Markdown, and Shell scripts
- **Commit Message Validation**: Ensures conventional commit format
- **Custom Checks**: Documentation and TODO reminders
- **Emergency Bypass**: Skip hooks when needed

### Usage

```bash
# Normal commit (runs all checks)
git commit

# Skip hooks entirely (emergency use only)
git commit --no-verify

# Skip specific hooks
SKIP=hook-id git commit
```

**⚠️ Important**: Avoid using `--no-verify` unless absolutely necessary. Pre-commit hooks catch issues that CI will enforce anyway. Bypassing them locally just delays the inevitable CI failures and wastes time.

### Installation

```bash
# Install pre-commit

# Option 1: Using pip (traditional)
pip install pre-commit

# Option 2: Using uv (faster, recommended)
# If you don't have uv: pip install uv
uv sync --dev  # Installs all dev dependencies including pre-commit

# Install the git hooks
pre-commit install
pre-commit install --hook-type commit-msg
```

### Running Manually

```bash
# Run on all files
pre-commit run --all-files

# Run specific hook
pre-commit run <hook-id>

# Update hook versions
pre-commit autoupdate
```

### Troubleshooting

If pre-commit fails:

1. **Review the error messages** - they show what needs to be fixed
2. **Check staged changes**: `git diff --cached`
3. **Check unstaged changes**: `git diff`
4. **Reset if needed**: `git reset` to unstage and review manually

### Configuration

The hooks are configured in `.pre-commit-config.yaml`. Each hook can:

- Auto-fix issues (formatting, trailing whitespace)
- Check for problems (linting, type checking)
- Validate files (YAML, JSON, TOML)
- Run custom checks (documentation reminders)

## Pull Request Workflow

### Creating Pull Requests

- **Always create a PR when a branch is ready for review**
- Update relevant documentation as part of each PR
- Include in PR description:
  - Brief summary of changes
  - Concise list of what was modified (file - description format)
  - For 10+ files: Group by category or component instead of listing each file

### GitHub CLI with Backticks

When using `gh pr edit` or `gh pr create` with bodies containing backticks, always use a heredoc to prevent shell interpretation:

```bash
gh pr create --title "type: brief description" --body "$(cat <<'EOF'
## Summary

Brief overview of what was done

## Changes

- `path/to/file.md` - What was changed
- `another/file.ts` - Brief description

EOF
)"
```

For large PRs with many files:

```bash
gh pr create --title "refactor: reorganize component structure" --body "$(cat <<'EOF'
## Summary

Reorganized component structure for better maintainability

## Changes

- **Components** (15 files) - Split large components into smaller ones
- **Tests** (12 files) - Updated test imports and added new test cases
- **Documentation** (5 files) - Updated component usage examples

EOF
)"
```

The single quotes around 'EOF' prevent variable and command substitution.

### Quality Gates

Before creating a PR, ensure:

- All tests pass
- Pre-commit hooks pass (`pre-commit run --all-files`)
- No memory leaks or performance regressions introduced
- Documentation is updated for new features or breaking changes

### Branch Protection

- **NEVER push directly to main branch**
- All changes must go through PR review process
- Squash commits for clean history when merging
- Delete feature branches after merge

## Tool-Specific Guidelines

Individual tools within this monorepo may have additional Git conventions or workflows. If present, these can be found in `docs/GIT.md` of each tool.
