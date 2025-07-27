#!/usr/bin/env bash

# find_parent_dir: Traverse up directory tree until finding a directory containing target
# Usage: find_parent_dir <target_name> [start_dir]
# Returns: Path to parent directory containing target, or empty string if not found
# Examples:
#   PROJECT_DIR=$(find_parent_dir "package.json")
#   if [[ -n "$PROJECT_DIR" ]]; then
#       echo "Found project at: $PROJECT_DIR"
#   fi
find_parent_dir() {
    local target="$1"
    local current_dir="${2:-$(pwd)}"
    
    # Convert to absolute path
    current_dir="$(cd "$current_dir" 2>/dev/null && pwd)" || return 1
    
    while [[ "$current_dir" != "/" ]]; do
        if [[ -e "$current_dir/$target" ]]; then
            echo "$current_dir"
            return 0
        fi
        current_dir="$(dirname "$current_dir")"
    done
    
    # Check root directory
    if [[ -e "/$target" ]]; then
        echo "/"
        return 0
    fi
    
    return 1
}

# cd_to_parent_containing: Change to parent directory containing target
# Usage: cd_to_parent_containing <target_name> [start_dir]
# Effect: **CHANGES CURRENT DIRECTORY** of the calling shell
# WARNING: This function modifies the working directory when sourced!
# Returns: 0 on success, 1 if target not found
# Examples:
#   cd_to_parent_containing "Cargo.toml" || die "Not in a Rust project"
#   cd_to_parent_containing "package.json" || die "Not in a Node.js project"
cd_to_parent_containing() {
    local target="$1"
    local start_dir="${2:-$(pwd)}"
    local parent_dir
    
    parent_dir="$(find_parent_dir "$target" "$start_dir")" || {
        echo "Error: Could not find parent directory containing '$target'" >&2
        return 1
    }
    
    cd "$parent_dir"
}


# resolve_path: Convert relative path to absolute path, following symlinks
# Usage: resolve_path <path>
# Returns: Absolute path with symlinks resolved
# Examples:
#   REAL_PATH=$(resolve_path "./symlink")
#   CONFIG=$(resolve_path "~/.config/app.conf")
resolve_path() {
    local path="$1"
    
    # Use readlink -f if available (most reliable for symlinks)
    if command -v readlink >/dev/null 2>&1; then
        readlink -f "$path" 2>/dev/null || echo "$path"
    else
        # Fallback implementation without readlink
        if [[ -d "$path" ]]; then
            (cd "$path" && pwd)
        elif [[ -f "$path" ]]; then
            echo "$(cd "$(dirname "$path")" && pwd)/$(basename "$path")"
        else
            echo "$path"
        fi
    fi
}

# path_exists: Check if path exists (file or directory)
# Usage: if path_exists "/some/path"; then ...; fi
path_exists() {
    [[ -e "$1" ]]
}

# is_absolute_path: Check if path is absolute
# Usage: if is_absolute_path "/some/path"; then ...; fi
is_absolute_path() {
    [[ "$1" = /* ]]
}

# is_readable_dir: Check if path is a readable directory
# Usage: if is_readable_dir "/some/dir"; then ...; fi
# Returns: 0 if directory exists and is readable, 1 otherwise
# Examples:
#   if is_readable_dir "$HOME/.config"; then
#       echo "Config directory is accessible"
#   fi
is_readable_dir() {
    [[ -d "$1" && -r "$1" ]]
}

# is_writable_dir: Check if path is a writable directory
# Usage: if is_writable_dir "/some/dir"; then ...; fi
# Returns: 0 if directory exists and is writable, 1 otherwise
# Examples:
#   if is_writable_dir "$TEMP_DIR"; then
#       echo "Can write to temp directory"
#   fi
is_writable_dir() {
    [[ -d "$1" && -w "$1" ]]
}

# ensure_dir: Create directory if it doesn't exist
# Usage: ensure_dir "/path/to/dir"
# Returns: 0 if directory exists or was created, 1 on failure
# Examples:
#   ensure_dir "$HOME/.cache/myapp" || die "Failed to create cache dir"
#   ensure_dir "/tmp/workspace"
ensure_dir() {
    local dir="$1"
    if [[ ! -d "$dir" ]]; then
        mkdir -p "$dir" || return 1
    fi
}