#!/bin/bash

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