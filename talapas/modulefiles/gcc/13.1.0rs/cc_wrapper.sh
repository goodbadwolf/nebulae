#!/bin/bash
# Wrapper that fixes GCC 13.1.0 specs issue for cargo/rust builds

# Uncomment the line below to see debug output
# export CARGO_CC_WRAPPER_DEBUG=1

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SPECS_FILE="$SCRIPT_DIR/specs"

function log() {
    if [ "${CARGO_CC_WRAPPER_DEBUG}" = "1" ]; then
        echo "$@" >&2
    fi
}

log "cc_wrapper: CC=$CC"
log "cc_wrapper: args=$*"
log "cc_wrapper: specs=$SPECS_FILE"

if [[ "$CC" == *"gcc-13.1.0"* ]] && [ -f "$SPECS_FILE" ]; then
    # Check if we're in the problematic GCC 13.1.0 environment
    log "cc_wrapper: Using fixed specs"
    exec "$CC" -specs="$SPECS_FILE" "$@"
else
    # Fall back to default cc behavior
    FALLBACK_CC=${CC:-/usr/bin/cc}
    log "cc_wrapper: Using fallback $FALLBACK_CC"
    exec "$FALLBACK_CC" "$@"
fi