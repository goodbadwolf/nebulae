#!/usr/bin/env bash

# string.sh - String manipulation utilities

# trim: Remove leading/trailing whitespace
# Usage: trimmed=$(trim "  text  ")
# Returns: String with leading/trailing whitespace removed
# Examples:
#   result=$(trim "  hello world  ")
#   echo "[$result]"  # Outputs: [hello world]
trim() {
    local var="$1"
    # Remove leading whitespace
    var="${var#"${var%%[![:space:]]*}"}"
    # Remove trailing whitespace
    var="${var%"${var##*[![:space:]]}"}"
    echo "$var"
}

# join_by: Join array elements with delimiter
# Usage: joined=$(join_by "delimiter" "${array[@]}")
# Returns: String with array elements joined by delimiter
# Examples:
#   arr=("apple" "banana" "cherry")
#   result=$(join_by ", " "${arr[@]}")
#   echo "$result"  # Outputs: apple, banana, cherry
#   
#   paths=("/usr/bin" "/usr/local/bin" "/home/user/bin")
#   PATH=$(join_by ":" "${paths[@]}")
join_by() {
    local IFS="$1"
    shift
    echo "$*"
}