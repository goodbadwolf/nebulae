# GCC 13.1.0rs Module - Patched Specs for Rust

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
module load gcc/13.1.0rs
```

The "rs" suffix stands for "Rust/Revised Specs".

## Testing

To verify the fix:
```bash
cd ~/modulefiles/gcc/13.1.0rs/verify-poc
./verify.sh
```

## Technical Details

The patched specs file corrects:
- `%@{I*&F*}` → `%{I*&F*}` in cpp_unique_options
- `%@{L*}` → `%{L*}` in link_command

This restores proper handling of include and library paths.