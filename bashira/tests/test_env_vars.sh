#!/bin/bash

# Test script for common.sh functions

BASHIRA_DIR="$(git rev-parse --show-toplevel || { echo "Error: Not in a git repository" >&2; exit 1; })/bashira"
source "$BASHIRA_DIR/env_vars.sh"

echo "=== Testing is_var_with_colons ==="
export TEST_VAR1="/usr/bin:/usr/local/bin"
export TEST_VAR2="single_value"
export TEST_VAR3=""
export TEST_VAR4=":"
export TEST_VAR5=":::"
unset TEST_VAR6

if is_var_with_colons "TEST_VAR1"; then
    echo "✓ TEST_VAR1 correctly identified as colon-delimited"
else
    echo "✗ TEST_VAR1 should be identified as colon-delimited"
fi

if is_var_with_colons "TEST_VAR2"; then
    echo "✗ TEST_VAR2 should not be identified as colon-delimited"
else
    echo "✓ TEST_VAR2 correctly not identified as colon-delimited"
fi

if is_var_with_colons "TEST_VAR3"; then
    echo "✗ TEST_VAR3 (empty) should not be identified as colon-delimited"
else
    echo "✓ TEST_VAR3 (empty) correctly not identified as colon-delimited"
fi

if is_var_with_colons "TEST_VAR4"; then
    echo "✓ TEST_VAR4 (:) correctly identified as colon-delimited"
else
    echo "✗ TEST_VAR4 (:) should be identified as colon-delimited"
fi

if is_var_with_colons "TEST_VAR5"; then
    echo "✓ TEST_VAR5 (:::) correctly identified as colon-delimited"
else
    echo "✗ TEST_VAR5 (:::) should be identified as colon-delimited"
fi

if is_var_with_colons "TEST_VAR6"; then
    echo "✗ TEST_VAR6 (unset) should not be identified as colon-delimited"
else
    echo "✓ TEST_VAR6 (unset) correctly not identified as colon-delimited"
fi

echo -e "\n=== Testing unpack_var_with_colons ==="
export TEST_PATH="/usr/bin:/usr/local/bin:/home/user/bin:::/opt/bin:"
echo "Original: $TEST_PATH"
values=($(unpack_var_with_colons "TEST_PATH"))
echo "Unpacked (${#values[@]} elements):"
for i in "${!values[@]}"; do
    echo "  [$i] '${values[$i]}'"
done

echo -e "\n=== Testing pack_var_with_colons ==="
test_values=("/usr/bin" "/usr/local/bin" "/home/user/bin with spaces" "/opt/bin")
echo "Original array:"
for i in "${!test_values[@]}"; do
    echo "  [$i] '${test_values[$i]}'"
done
packed=$(pack_var_with_colons "${test_values[@]}")
echo "Packed: $packed"

echo -e "\n=== Testing remove_value_from_var ==="
export TEST_REMOVE="/usr/bin:/usr/local/bin:/home/user/bin:/opt/bin"
echo "Original: $TEST_REMOVE"

# Test removing from middle
remove_value_from_var "TEST_REMOVE" "/usr/local/bin"
echo "After removing /usr/local/bin: $TEST_REMOVE"

# Test removing from beginning
remove_value_from_var "TEST_REMOVE" "/usr/bin"
echo "After removing /usr/bin: $TEST_REMOVE"

# Test removing from end
remove_value_from_var "TEST_REMOVE" "/opt/bin"
echo "After removing /opt/bin: $TEST_REMOVE"

# Test removing last remaining value
remove_value_from_var "TEST_REMOVE" "/home/user/bin"
echo "After removing /home/user/bin: '$TEST_REMOVE'"

# Test removing non-existent value
export TEST_REMOVE2="/usr/bin:/usr/local/bin"
if remove_value_from_var "TEST_REMOVE2" "/not/exist"; then
    echo "✗ Should have returned 1 for non-existent value"
else
    echo "✓ Correctly returned 1 for non-existent value"
fi

echo -e "\n=== Testing edge cases ==="
# Test with PATH-like variable with duplicate colons
export TEST_EDGE=":/usr/bin::/usr/local/bin:::"
echo "Edge case with multiple colons: $TEST_EDGE"
values=($(unpack_var_with_colons "TEST_EDGE"))
echo "Unpacked (${#values[@]} elements):"
for v in "${values[@]}"; do
    echo "  '$v'"
done

# Clean up
unset TEST_VAR1 TEST_VAR2 TEST_VAR3 TEST_VAR4 TEST_VAR5 TEST_PATH TEST_REMOVE TEST_REMOVE2 TEST_EDGE