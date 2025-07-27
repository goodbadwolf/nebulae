#!/bin/bash

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
# Effect: Changes current directory to parent containing target
# Examples:
#   cd_to_parent_containing "Cargo.toml" || die "Not in a Rust project"
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


# resolve_path: Convert relative path to absolute path
# Usage: resolve_path <path>
# Returns: Absolute path
resolve_path() {
    local path="$1"
    if [[ -d "$path" ]]; then
        (cd "$path" && pwd)
    elif [[ -f "$path" ]]; then
        echo "$(cd "$(dirname "$path")" && pwd)/$(basename "$path")"
    else
        echo "$path"
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