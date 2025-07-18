# Shared Configuration Directory

This directory contains shared configuration files for the Nebulae monorepo. The approach is simple and effective for a
hobby project.

## Files

### .markdownlint.json

Markdown linting rules used across the monorepo. Referenced by pre-commit hooks to ensure consistent markdown formatting.

### prettierrc.json

Shared Prettier formatting rules. This is the single source of truth for code formatting across all tools.

### yamllint.yml

YAML linting configuration for consistent YAML file formatting.

### eslint.common.ts

Shared ESLint configuration for TypeScript projects. Includes:

- TypeScript recommended rules
- Prettier integration for formatting
- Import sorting with simple-import-sort
- Consistent error handling patterns

## How It Works

The configuration approach is intentionally simple:

1. **Shared configs live here** - All common configuration rules are stored in this directory
2. **Tools reference via strings** - Each tool has a `.prettierrc.json` file containing just a string path like `"../../config/prettierrc.json"`
3. **No complex inheritance** - Simple string references work perfectly and are easier to understand

## Example Usage

### Prettier Config

```json
// In kiku/core/.prettierrc.json
"../../config/prettierrc.json"
```

```json
// In root .prettierrc.json
"./config/prettierrc.json"
```

### ESLint Config

```javascript
// In kiku/core/eslint.config.js or tanaka/extension/eslint.config.ts
import baseConfig from "../../config/eslint.common.ts";

export default baseConfig;
```
