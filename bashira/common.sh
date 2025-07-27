#!/usr/bin/env bash

# get_script_dir: Get absolute directory of the current script
# Usage: script_dir=$(get_script_dir)
# Returns: Absolute path to directory containing the script
# Examples:
#   SCRIPT_DIR=$(get_script_dir)
#   CONFIG_FILE="$SCRIPT_DIR/config.json"
get_script_dir() {
    echo "$( cd "$( dirname "${BASH_SOURCE[1]}" )" && pwd )"
}

# die: Print error message with calling function name and exit with code
# Usage: die "Error message" [exit_code]
# Examples:
#   die "File not found"
#   die "Invalid argument" 2
# Output format: "calling_function: Error message"
die() {
    echo "${FUNCNAME[1]}: ${1:-Error}" >&2
    exit "${2:-1}"
}

# has_command: Check if a command exists
# Usage: if has_command git; then ...; fi
# Examples:
#   has_command docker || die "Docker is required but not installed"
#   has_command jq || die "jq is required but not installed"
has_command() {
    command -v "$1" >/dev/null 2>&1
}

# is_sourced: Check if script is being sourced vs executed
# Usage: if is_sourced; then ...; fi
is_sourced() {
    [[ "${BASH_SOURCE[0]}" != "${0}" ]]
}
