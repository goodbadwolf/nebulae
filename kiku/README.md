# Kiku

Shared utilities and foundational components for the Nebulae monorepo.

> **Why "Kiku"?**  
> Kiku (**菊**) means chrysanthemum in Japanese. Like the flower's many petals radiating from a single center,
Kiku provides core utilities that support all tools in the Nebulae ecosystem.

## Features

- **Type-safe deep merging** - Recursively merge objects with full type safety
- **WithDefaults utility** - Show default values in IntelliSense while preserving type flexibility
- **DeepPartial types** - Make all properties optional recursively
- **Comprehensive edge case handling** - Tested with functions, symbols, and deeply nested objects

## Usage

```bash
pnpm add @kiku/core@workspace:*
```

```typescript
import { deepMerge, WithDefaults, applyDefaults } from '@kiku/core';

// Type-safe defaults with IntelliSense
interface Config {
  theme?: string;
  debug?: boolean;
}

type ConfigWithDefaults = WithDefaults<Config, {
  theme: "dark";
  debug: false;
}>;

// Runtime application
const config = applyDefaults(
  { theme: "dark", debug: false },
  { theme: "light" }
);
```

## Documentation

- [WithDefaults Usage Guide](./core/docs/WITH-DEFAULTS.md) - Comprehensive guide for the WithDefaults utility

## Development

```bash
pnpm build       # Build the library
pnpm dev         # Watch mode
pnpm typecheck   # Type checking
pnpm tests       # Run tests
```
