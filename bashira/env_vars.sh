#!/usr/bin/env bash

# env_vars.sh - Utilities for environment variables

# Check Bash version (requires 4.3+ for nameref support)
if [[ "${BASH_VERSINFO[0]}" -lt 4 ]] || 
   { [[ "${BASH_VERSINFO[0]}" -eq 4 ]] && [[ "${BASH_VERSINFO[1]}" -lt 3 ]]; }; then
    echo "Error: env_vars.sh requires Bash 4.3 or newer for nameref support" >&2
    return 1
fi

# COLON LIST
# ===================================
# 
# A "colon_list" is a string format for storing lists of values separated by colons (:).
# Common examples include PATH, LD_LIBRARY_PATH, MODULEPATH, etc.
#
# What is a valid colon_list?
# ---------------------------
# 1. Empty string "" - Special case representing an empty list
# 2. Any string containing ':' - Represents a list with one or more items
# 3. Single values without colons (e.g., "/usr/bin") are NOT valid colon_lists
# 4. Unset/undefined variables are NOT colon_lists
#
# Examples:
# - Valid:   "", ":", "a:b", "/usr/bin:/usr/local/bin", ":::", "a::b:"
# - Invalid: "single_value", unset variables
#
# Empty Value Handling
# -------------------------------------
# When unpacking a colon_list:
# - ALL empty values are removed (leading, trailing, and internal)
# - This simplifies the implementation and matches typical PATH usage
#
# Examples:
# - "a::b:c:" → ["a", "b", "c"]
# - ":::a::b:::" → ["a", "b"]
# - "::::" → [] (empty list)
# - ":" → [] (empty list)
#
# Design Rationale
# ---------------
# - Empty string as valid list: Allows treating any variable as potentially list-valued
# - Single values need colons: Clear distinction between scalar and list intent
# - Empty value handling: Matches PATH behavior while preserving meaningful gaps

# is_colon_list: Check if a value is a colon-delimited list
# Usage: if is_colon_list "$PATH"; then ...; fi
# Returns: 0 if the value is a valid colon list, 1 otherwise
# Valid colon lists:
#   - Empty string "" (special case - empty list)
#   - Any string containing ':'
# Examples:
#   is_colon_list "$PATH"              # true if PATH contains ':' or is empty
#   is_colon_list "/usr/bin"           # false (no colon)
#   is_colon_list "/usr/bin:/usr/local/bin"  # true (has colon)
is_colon_list() {
    local value="$1"
    
    # Empty string is a valid colon list (empty list)
    if [[ -z "$value" ]]; then
        return 0  # true
    fi
    
    # Must contain at least one colon to be a list
    [[ "$value" == *:* ]]  # returns 0 (true) if match, 1 (false) if not
}

# unpack_colon_list: Unpack a colon-delimited list value into an array
# Usage: 
#   local values
#   unpack_colon_list values "$PATH"
# Parameters:
#   $1 - Name of array variable to populate (passed by reference)
#   $2 - Colon-delimited string to unpack
# Note: Requires Bash 4.3+ for nameref support
# Examples:
#   unpack_colon_list my_array "a::b:c:" # my_array=("a" "b" "c")
#   unpack_colon_list my_array "::::"    # my_array=()
#   unpack_colon_list my_array ":"       # my_array=()
unpack_colon_list() {
    local -n _unpack_result=$1  # nameref to the output array
    local value="$2"
    
    # Clear the array
    _unpack_result=()
    
    # Handle empty string (valid empty list)
    if [[ -z "$value" ]]; then
        return
    fi
    
    # Split the value into an array, with the colons as the delimiter
    local IFS=':'
    read -ra temp_values <<< "$value"
    
    # Add only non-empty values to result array
    for val in "${temp_values[@]}"; do
        if [[ -n "$val" ]]; then
            _unpack_result+=("$val")
        fi
    done
}

# pack_colon_list: Pack an array of values into a colon-delimited string
# Usage: packed=$(pack_colon_list "${values[@]}")
# Returns: String with values separated by colons
# Examples:
#   values=("/usr/bin" "/usr/local/bin" "/home/user/bin")
#   PATH=$(pack_colon_list "${values[@]}")
pack_colon_list() {
    local values=("$@")
    local IFS=':'
    echo "${values[*]}"
}

# remove_from_colon_list: Remove a value from a colon-delimited list
# Usage: new_list=$(remove_from_colon_list "$PATH" "/path/to/remove")
# Returns: The modified list (prints to stdout)
# Exit code: 0 if successful, 1 if the value was not found
# Examples:
#   NEW_PATH=$(remove_from_colon_list "$PATH" "/usr/bin")
#   NEW_LIST=$(remove_from_colon_list "a:b:c" "b")  # returns "a:c"
remove_from_colon_list() {
    local list_value="$1"
    local value_to_remove="$2"
    
    # Special case: single value without colons
    if [[ "$list_value" == "$value_to_remove" ]]; then
        echo ""
        return 0  # true - value found and removed
    fi
    
    # Check if it's a colon list
    if ! is_colon_list "$list_value"; then
        # Not a colon list and not the exact value
        echo "$list_value"
        return 1  # false - not a colon list
    fi
    
    # Get current values
    local -a current_values
    unpack_colon_list current_values "$list_value"
    
    local new_values=()
    local found=0
    
    # Filter out the value to remove
    for value in "${current_values[@]}"; do
        if [[ "$value" == "$value_to_remove" ]]; then
            found=1
        else
            new_values+=("$value")
        fi
    done
    
    # Check if value was found
    if [[ $found -eq 0 ]]; then
        echo "$list_value"
        return 1  # false - value not found
    fi
    
    # Return the new value
    if [[ ${#new_values[@]} -eq 0 ]]; then
        # All values removed, return empty string
        echo ""
    else
        # Pack and return the new values
        pack_colon_list "${new_values[@]}"
    fi
    
    return 0  # true - value found and removed
}

# ============================================================================
# VARIABLE WRAPPER FUNCTIONS (_var suffix)
# These functions work with variable names and can modify variables in place
# ============================================================================

# is_colon_list_var: Check if a variable contains a colon-delimited list
# Usage: if is_colon_list_var "PATH"; then ...; fi
# Returns: 0 if the variable exists and is a valid colon list, 1 otherwise
# Examples:
#   is_colon_list_var "PATH"        # true if PATH exists and is a colon list
#   is_colon_list_var "UNDEFINED"   # false (variable doesn't exist)
is_colon_list_var() {
    local var_name="$1"
    
    # Check if variable exists
    if [[ ! -v $var_name ]]; then
        return 1  # false - variable doesn't exist
    fi
    
    # Check if its value is a colon list
    is_colon_list "${!var_name}"
}

# unpack_colon_list_var: Unpack a colon-delimited list from a variable
# Usage: 
#   local values
#   unpack_colon_list_var values "PATH"
# Parameters:
#   $1 - Name of array variable to populate (passed by reference)
#   $2 - Name of variable containing colon-delimited list
# Examples:
#   unpack_colon_list_var my_array "PATH"
#   for dir in "${my_array[@]}"; do ...; done
unpack_colon_list_var() {
    local -n _unpack_var_result=$1  # nameref to the output array
    local var_name="$2"
    
    # Check if variable exists
    if [[ ! -v $var_name ]]; then
        return 1  # false - variable doesn't exist
    fi
    
    # Unpack its value
    unpack_colon_list _unpack_var_result "${!var_name}"
}

# remove_from_colon_list_var: Remove a value from a colon-delimited list variable (modifies in place)
# Usage: remove_from_colon_list_var "PATH" "/path/to/remove"
# Effect: Modifies the variable directly
# Returns: 0 if successful, 1 if the value was not found
# Examples:
#   remove_from_colon_list_var "PATH" "/usr/bin"     # PATH is modified
#   remove_from_colon_list_var "MODULEPATH" "/module/path"
remove_from_colon_list_var() {
    local var_name="$1"
    local value_to_remove="$2"
    
    # Check if variable exists
    if [[ ! -v $var_name ]]; then
        return 1  # false - variable doesn't exist
    fi
    
    # Get the new value
    local new_value
    new_value=$(remove_from_colon_list "${!var_name}" "$value_to_remove")
    local exit_code=$?
    
    # Update the variable
    export "$var_name"="$new_value"
    
    return $exit_code
}