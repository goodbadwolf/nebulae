# Configuration Files

This directory contains shared configuration files for the Nebulae monorepo.

## Files

### markdownlint.json

Markdown linting rules used by pre-commit hooks and CI/CD pipelines.

### prettierrc.json

Code formatting rules for Prettier. Used by:

- Root `.prettierrc.json` (references this file)
- Individual tools can reference this shared config
- Pre-commit hooks for consistent formatting

### yamllint.yml

YAML linting configuration for validating YAML files across the monorepo.

## Usage

These configuration files are referenced by:

- `.pre-commit-config.yaml` - Pre-commit hooks use these configs
- Individual tool configurations can extend or reference these shared configs

## Why Centralized?

Having configuration files in one place:

- Ensures consistency across all tools in the monorepo
- Makes it easier to update rules that affect the entire codebase
- Reduces duplication and maintenance overhead
