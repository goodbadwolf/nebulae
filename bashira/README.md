# Bashira

A collection of helpful bash utilities for the Nebulae monorepo.

**Name Origin**: A play on "Bash" and the Arabic word bashīrah (بشيرة), meaning "bringer of good tidings." Signals a collection of helpful scripts that deliver good results.

## Usage

Source the utilities you need in your scripts:

```bash
# Recommended: Find bashira from anywhere in the repository
BASHIRA_DIR="$(git rev-parse --show-toplevel || { echo "Error: Not in a git repository" >&2; exit 1; })/bashira"
source "$BASHIRA_DIR/common.sh"
source "$BASHIRA_DIR/filesystem.sh"
```

## Available Utilities

### common.sh
Core utilities used across scripts (script directory resolution, error handling, command checks)

### filesystem.sh
Directory traversal and path manipulation utilities

### git.sh
Git repository utilities for finding repo root and ensuring git context

### env_vars.sh
Utilities for managing colon-delimited environment variables (PATH, MODULEPATH, etc.)

## Adding New Utilities

When adding new functions:

1. Group related functions together
2. Add clear documentation comments
3. Use consistent naming patterns
4. Test with various edge cases (spaces in paths, symlinks, etc.)
5. Follow the existing code style