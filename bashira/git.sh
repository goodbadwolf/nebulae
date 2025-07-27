#!/usr/bin/env bash

# find_git_root: Find the root of the current git repository
# Usage: find_git_root [start_dir]
# Returns: Path to git repository root, or empty string if not in a git repo
# Examples:
#   REPO_ROOT=$(find_git_root)
#   if [[ -n "$REPO_ROOT" ]]; then
#       cd "$REPO_ROOT"
#   fi
find_git_root() {
    local git_root
    git_root="$(git rev-parse --show-toplevel 2>/dev/null)" || {
        echo "Error: Not in a git repository" >&2
        echo ""
        return 1
    }
    echo "$git_root"
}

# require_git_root: Ensure we're in a git repository, exit if not
# Usage: require_git_root [error_message]
# Examples:
#   REPO_ROOT=$(require_git_root "This script must be run from within the repository")
require_git_root() {
    local git_root
    local error_msg="${1:-Error: Not in a git repository}"
    
    git_root="$(find_git_root)" || true
    if [[ -z "$git_root" ]]; then
        echo "$error_msg" >&2
        exit 1
    fi
    echo "$git_root"
}

# is_git_repo: Check if current directory is in a git repo
# Usage: if is_git_repo; then ...; fi
# Returns: 0 if in a git repository, 1 otherwise
# Examples:
#   if is_git_repo; then
#       echo "In a git repository"
#   fi
is_git_repo() {
    git rev-parse --git-dir >/dev/null 2>&1
}

# git_current_branch: Get current git branch name
# Usage: branch=$(git_current_branch)
# Returns: Current branch name, or empty string if not in a git repo
# Examples:
#   BRANCH=$(git_current_branch)
#   echo "Working on branch: $BRANCH"
git_current_branch() {
    git rev-parse --abbrev-ref HEAD 2>/dev/null
}

# git_has_uncommitted_changes: Check for uncommitted changes
# Usage: if git_has_uncommitted_changes; then ...; fi
# Returns: 0 if there are uncommitted changes, 1 if working tree is clean
# Examples:
#   if git_has_uncommitted_changes; then
#       echo "Please commit your changes before proceeding"
#   fi
git_has_uncommitted_changes() {
    ! git diff-index --quiet HEAD -- 2>/dev/null
}