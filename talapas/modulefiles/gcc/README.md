# GCC 13.1.0-rs Module - Patched Specs for Rust

This module provides a patched version of GCC 13.1.0 that fixes compilation errors when using include (`-I`) or library (`-L`) path flags.

## Problem

The system GCC 13.1.0 specs file contains invalid `%@` syntax that causes:
```
cc: error: spec failure: unrecognized spec option '@'
```

This breaks Rust/cargo builds and any compilation using path flags.

## Solution

This module loads the original GCC 13.1.0 and overrides it with a patched specs file that replaces `%@` with standard `%` syntax.

## Installation

Add to your `~/.bashrc`:
```bash
export MODULEPATH=~/modulefiles:$MODULEPATH
```

## Usage

```bash
module load gcc/13.1.0-rs
```

The "rs" suffix stands for "Rust/Revised Specs".

## Testing

To verify the fix:
```bash
cd ~/modulefiles/gcc/files/verify-poc
./verify.sh
```

## Technical Details

The patched specs file makes minimal changes from the system module version:
- `%@{I*&F*}` → `%{I*&F*}` in cpp_unique_options (line 32)
- `%@{L*}` → `%{L*}` in link_command (line 143)

All other module functionality remains intact, including rpath settings. This minimal approach ensures maximum compatibility while fixing the specific issue affecting Rust/cargo builds.