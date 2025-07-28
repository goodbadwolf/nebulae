# Talapas

Tools and configurations for University of Oregon's HPC cluster.

## Contents

### Modulefiles

Custom environment modules for Talapas:

- **gcc/13.1.0-rs** - Patched GCC 13.1.0 module that fixes spec file issues affecting Rust/cargo builds

## Usage

Add the modulefiles to your environment:

```bash
export MODULEPATH=~/projects/nebulae/talapas/modulefiles:$MODULEPATH
```

Then load modules as needed:

```bash
module load gcc/13.1.0-rs
```