#!/usr/bin/env bash

# Test file for env_vars.sh using bashunit

function set_up() {
    BASHIRA_DIR="$(git rev-parse --show-toplevel || { echo "Error: Not in a git repository" >&2; exit 1; })/bashira"
    source "$BASHIRA_DIR/env_vars.sh"
}

function tear_down() {
    # Clean up any test variables
    unset TEST_VAR1 TEST_VAR2 TEST_VAR3 TEST_VAR4 TEST_VAR5 TEST_VAR6
    unset TEST_PATH TEST_REMOVE TEST_REMOVE2 TEST_EDGE
}

# is_colon_list tests

function test_is_colon_list_with_colon_delimited() {
    local test_value="/usr/bin:/usr/local/bin"
    
    # Test with value
    if is_colon_list "$test_value"; then
        assert_true true
    else
        assert_true false
    fi
}

function test_is_colon_list_with_single_value() {
    local test_value="single_value"
    
    if is_colon_list "$test_value"; then
        assert_false true
    else
        assert_false false
    fi
}

function test_is_colon_list_with_empty_string() {
    local test_value=""
    
    # Empty string is a valid colon list (empty list)
    if is_colon_list "$test_value"; then
        assert_true true
    else
        assert_true false
    fi
}

function test_is_colon_list_with_single_colon() {
    local test_value=":"
    
    if is_colon_list "$test_value"; then
        assert_true true
    else
        assert_true false
    fi
}

function test_is_colon_list_with_multiple_colons() {
    local test_value=":::"
    
    if is_colon_list "$test_value"; then
        assert_true true
    else
        assert_true false
    fi
}

# Note: We no longer test unset variables with value-based functions
# Use is_colon_list_var for variable-based tests

# unpack_colon_list tests

function test_unpack_colon_list_basic() {
    local test_value="/usr/bin:/usr/local/bin:/home/user/bin:/opt/bin"
    local -a values
    unpack_colon_list values "$test_value"
    
    assert_equals "4" "${#values[@]}"
    assert_same "/usr/bin" "${values[0]}"
    assert_same "/usr/local/bin" "${values[1]}"
    assert_same "/home/user/bin" "${values[2]}"
    assert_same "/opt/bin" "${values[3]}"
}

function test_unpack_colon_list_with_empty_values() {
    # Test that ALL empty values are removed
    local test_value=":/usr/bin::/usr/local/bin:::"
    local -a values
    unpack_colon_list values "$test_value"
    
    assert_equals "2" "${#values[@]}"
    assert_same "/usr/bin" "${values[0]}"
    assert_same "/usr/local/bin" "${values[1]}"
}

function test_unpack_colon_list_all_empty() {
    # Test all empty values
    local test_value="::::"
    local -a values
    unpack_colon_list values "$test_value"
    
    assert_equals "0" "${#values[@]}"
}

function test_unpack_colon_list_single_colon() {
    # Test single colon
    local test_value=":"
    local -a values
    unpack_colon_list values "$test_value"
    
    assert_equals "0" "${#values[@]}"
}

# pack_colon_list tests

function test_pack_colon_list_basic() {
    local test_values=("/usr/bin" "/usr/local/bin" "/opt/bin")
    local packed=$(pack_colon_list "${test_values[@]}")
    
    assert_same "/usr/bin:/usr/local/bin:/opt/bin" "$packed"
}

function test_pack_colon_list_with_spaces() {
    local test_values=("/usr/bin" "/home/user/my bin" "/opt/bin")
    local packed=$(pack_colon_list "${test_values[@]}")
    
    assert_same "/usr/bin:/home/user/my bin:/opt/bin" "$packed"
}

function test_pack_colon_list_single_value() {
    local test_values=("/usr/bin")
    local packed=$(pack_colon_list "${test_values[@]}")
    
    assert_same "/usr/bin" "$packed"
}

function test_pack_colon_list_empty() {
    local test_values=()
    local packed=$(pack_colon_list "${test_values[@]}")
    
    assert_empty "$packed"
}

# remove_from_colon_list tests

function test_remove_from_colon_list_from_middle() {
    local test_value="/usr/bin:/usr/local/bin:/home/user/bin:/opt/bin"
    local result=$(remove_from_colon_list "$test_value" "/usr/local/bin")
    
    assert_same "/usr/bin:/home/user/bin:/opt/bin" "$result"
}

function test_remove_from_colon_list_from_beginning() {
    local test_value="/usr/bin:/usr/local/bin:/home/user/bin"
    local result=$(remove_from_colon_list "$test_value" "/usr/bin")
    
    assert_same "/usr/local/bin:/home/user/bin" "$result"
}

function test_remove_from_colon_list_from_end() {
    local test_value="/usr/bin:/usr/local/bin:/opt/bin"
    local result=$(remove_from_colon_list "$test_value" "/opt/bin")
    
    assert_same "/usr/bin:/usr/local/bin" "$result"
}

function test_remove_from_colon_list_single_value() {
    local test_value="/home/user/bin"
    local result=$(remove_from_colon_list "$test_value" "/home/user/bin")
    
    assert_empty "$result"
}

function test_remove_from_colon_list_non_existent() {
    local test_value="/usr/bin:/usr/local/bin"
    
    # Test the exit code
    if remove_from_colon_list "$test_value" "/not/exist" >/dev/null 2>&1; then
        assert_false true  # Should have failed
    else
        assert_false false  # Correctly returned failure
    fi
    
    # Test that the value is unchanged
    local result=$(remove_from_colon_list "$test_value" "/not/exist")
    assert_same "$test_value" "$result"
}

# Note: Removed test for unset variable as value-based functions don't handle variables

# ============================================================================
# VARIABLE WRAPPER FUNCTION TESTS (_var suffix)
# ============================================================================

function test_is_colon_list_var_with_valid_var() {
    export TEST_VAR="/usr/bin:/usr/local/bin"
    
    if is_colon_list_var "TEST_VAR"; then
        assert_true true
    else
        assert_true false
    fi
}

function test_is_colon_list_var_with_unset_var() {
    unset TEST_VAR
    
    if is_colon_list_var "TEST_VAR"; then
        assert_false true
    else
        assert_false false
    fi
}

function test_unpack_colon_list_var() {
    export TEST_VAR="/usr/bin:/usr/local/bin"
    local -a values
    unpack_colon_list_var values "TEST_VAR"
    
    assert_equals "2" "${#values[@]}"
    assert_same "/usr/bin" "${values[0]}"
    assert_same "/usr/local/bin" "${values[1]}"
}

function test_remove_from_colon_list_var() {
    export TEST_VAR="/usr/bin:/usr/local/bin:/opt/bin"
    remove_from_colon_list_var "TEST_VAR" "/usr/local/bin"
    
    assert_same "/usr/bin:/opt/bin" "$TEST_VAR"
}

# Additional edge case tests

function test_unpack_colon_list_with_empty_string() {
    local test_value=""
    local -a values
    unpack_colon_list values "$test_value"
    
    assert_equals "0" "${#values[@]}"
}

function test_pack_colon_list_preserves_spaces() {
    local test_values=("path with spaces" "another path" "third")
    local packed=$(pack_colon_list "${test_values[@]}")
    
    assert_same "path with spaces:another path:third" "$packed"
}

function test_remove_from_colon_list_with_spaces() {
    local test_value="path one:path with spaces:path three"
    local result=$(remove_from_colon_list "$test_value" "path with spaces")
    
    assert_same "path one:path three" "$result"
}