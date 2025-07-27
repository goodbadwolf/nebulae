#!/bin/bash

# env_vars.sh - Utilities for managing colon-delimited environment variables (PATH, MODULEPATH, etc.)

# is_var_with_colons: Check if a variable is a string with colons as the delimiter
# Usage: if is_var_with_colons "PATH"; then ...; fi
# Returns: 0 if the variable is a string with colons as the delimiter, 1 otherwise
# Examples:
#   if is_var_with_colons "PATH"; then ...; fi
#   if is_var_with_colons "EMPTY_VAR"; then ...; fi
is_var_with_colons() {
    local var_name="$1"
    local var_value="${!var_name}"
    
    # A variable with colons should:
    # - Exist (even if empty)
    # - Contain at least one colon OR be exactly ":"
    # - Not be a single non-colon value
    if [[ ! -v "$var_name" ]]; then
        return 1
    fi
    
    # Empty string is not colon-delimited
    if [[ -z "$var_value" ]]; then
        return 1
    fi
    
    # Single colon or contains colons = colon-delimited
    [[ "$var_value" == ":" || "$var_value" == *:* ]]
}

# unpack_var_with_colons: Unpack a variable with colons as the delimiter
# Usage: values=($(unpack_var_with_colons "PATH"))
# Returns: Array of values, with empty values removed
# Examples:
#   values=($(unpack_var_with_colons "PATH"))
#   echo "${values[@]}" # Prints the values, separated by spaces
unpack_var_with_colons() {
    local var_name="$1"
    local var_value="${!var_name}"
    
    # Split the variable into an array, with the colons as the delimiter
    local IFS=':'
    read -ra values <<< "$var_value"

    # Remove empty values
    local cleaned_values=()
    for value in "${values[@]}"; do
        if [[ -n "$value" ]]; then
            cleaned_values+=("$value")
        fi
    done
    echo "${cleaned_values[@]}"
}

# pack_var_with_colons: Pack an array of values into a variable with colons as the delimiter
# Usage: packed=$(pack_var_with_colons "${values[@]}")
# Returns: String with values separated by colons
# Examples:
#   values=("/usr/bin" "/usr/local/bin" "/home/user/bin")
#   PATH=$(pack_var_with_colons "${values[@]}")
pack_var_with_colons() {
    local values=("$@")
    local IFS=':'
    echo "${values[*]}"
}

# remove_value_from_var: Remove a value from an environment variable with colons as the delimiter
# Usage: remove_value_from_var "PATH" "/path/to/remove"
# Returns: 0 if successful, 1 if the value was not found
# Examples:
#   remove_value_from_var "PATH" "/path/to/remove"
#   remove_value_from_var "MODULEPATH" "/path/to/remove"
remove_value_from_var() {
    local var_name="$1"
    local value_to_remove="$2"
    local var_value="${!var_name}"

    # Verify that the variable exists
    if [[ -z "$var_value" ]]; then
        return 0
    fi

    # Check if the value exists in the variable
    if [[ ":$var_value:" != *":$value_to_remove:"* ]]; then
        return 1
    fi

    # Remove the value, handling edge cases
    # - Value at the beginning: value:rest -> rest
    # - Value in the middle: first:value:rest -> first:rest
    # - Value at the end: first:value -> first
    # - Only value: value -> empty
    var_value=":$var_value:"
    var_value="${var_value//:$value_to_remove:/:}"
    var_value="${var_value#:}"
    var_value="${var_value%:}"
    
    export "$var_name"="$var_value"
    return 0
}