#!/usr/bin/env bash

BASHIRA_DIR="$(git rev-parse --show-toplevel || { echo "Error: Not in a git repository" >&2; exit 1; })/bashira"
source "$BASHIRA_DIR/common.sh"
source "$BASHIRA_DIR/env_vars.sh"
source "$BASHIRA_DIR/filesystem.sh"

SCRIPT_DIR=$(get_script_dir)

echo "=== Testing GCC 13.1.0 specs issue ==="
echo

MY_MODULEPATH="$(find_parent_dir "modulefiles" "$SCRIPT_DIR")/modulefiles"
echo "Custom modulepath: $MY_MODULEPATH"

if is_in_colon_list "$MODULEPATH" "$MY_MODULEPATH"; then
    module unuse "$MY_MODULEPATH"
    echo "MODULEPATH: $(unpack_colon_list_var MODULEPATH)"
fi

# Clean any previous builds
cargo clean 2>/dev/null
rm -f test_c.out 2>/dev/null

echo "1. Testing with original gcc/13.1.0 module..."
module purge
module load gcc/13.1.0
echo "   Module loaded: $(module list 2>&1 | grep gcc)"
echo "   GCC version: $(gcc --version | head -1)"
echo "   a) Attempting cargo build..."
if cargo build 2>&1 | grep -q "unrecognized spec option '@'"; then
    echo "      ⚠️  Got expected '@' error with original module (this confirms the issue)"
else
    if cargo build 2>&1 | grep -q "error"; then
        echo "      ❌ FAILED with different error"
    else
        echo "      ⚠️  WARNING: Build succeeded - issue may be fixed upstream"
    fi
fi
echo "   b) Attempting C compilation with -I and -L flags..."
if gcc -I/usr/include -L/usr/lib -o test_c.out test.c 2>&1; then
    echo "      ✅ SUCCESS: C compilation completed with original module!"
    echo "   Running C test program:"
    ./test_c.out
else
    echo "      ❌ C compilation failed"
fi

# Clean any previous builds
echo "   Cleaning any previous builds"
cargo clean 2>/dev/null
rm -f test_c.out 2>/dev/null

echo
echo "2. Testing with patched gcc/13.1.0rs module..."

module purge
module use "$MY_MODULEPATH"
module load gcc/13.1.0rs
echo "   Modules loaded: $(module list 2>&1 | grep -E 'gcc|13.1.0')"
echo "   GCC version: $(gcc --version | head -1)"
echo "   CC env var: $CC"
echo "   CARGO_TARGET linker: $CARGO_TARGET_X86_64_UNKNOWN_LINUX_GNU_LINKER"
echo "   a) Attempting cargo build..."
if cargo build 2>/dev/null; then
    echo "   ✅ SUCCESS: Build completed with patched module!"
    echo "   Running test program:"
    ./target/debug/gcc-specs-test
    echo
    echo "=== Version Information ==="
    echo "   rustc: $(rustc --version)"
    echo "   cargo: $(cargo --version)"
    echo "   gcc: $(gcc --version | head -1)"
else
    echo "   ❌ FAILED: Build still failing with patched module"
fi
echo "   b) Attempting C compilation with -I and -L flags..."
if gcc -I/usr/include -L/usr/lib -o test_c.out test.c 2>&1; then
    echo "   ✅ SUCCESS: C compilation completed with patched module!"
    echo "   Running C test program:"
    ./test_c.out
else
    echo "   ❌ C compilation failed"
fi

# Cleanup
cargo clean 2>/dev/null
rm -f test_c.out 2>/dev/null
echo
echo "Test complete!"