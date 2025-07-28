#!/bin/bash
# Wrapper that fixes GCC 13.1.0 specs issue for cargo/rust builds

# Uncomment the line below to see debug output
export RS_WRAPPER_DEBUG=0

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SPECS_FILENAME="patched.specs"
SPECS_FILE="$SCRIPT_DIR/$SPECS_FILENAME"

function log() {
    if [ "${RS_WRAPPER_DEBUG}" = "1" ]; then
        echo "$@" >&2
    fi
}

log "rs_wrapper: Compiler: $RS_COMPILER"
log "rs_wrapper: Compiler args: $@"
log "rs_wrapper: Specs file: $SPECS_FILE"

if [ -f "$SPECS_FILE" ]; then
    log "rs_wrapper: Using fixed specs"
    exec "$RS_COMPILER" "-specs=$SPECS_FILE" "$@"
else
    # Fall back to default cc behavior
    fallback_cc=${RS_COMPILER:-gcc}
    log "rs_wrapper: Using fallback $fallback_cc"
    exec "$fallback_cc" "$@"
fi