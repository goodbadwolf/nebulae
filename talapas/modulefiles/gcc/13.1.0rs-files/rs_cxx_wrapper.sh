#!/bin/bash
# Wrapper that fixes GCC 13.1.0 specs issue for cargo/rust builds
# This wrapper is used to wrap the cxx compiler

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export RS_COMPILER="$RS_ORIG_CXX"
source "$SCRIPT_DIR/rs_wrapper_common.sh"