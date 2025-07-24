# WithDefaults Advanced Usage Guide

## Overview

The WithDefaults type utility provides a sophisticated way to merge default values with optional types while maintaining
IntelliSense visibility. This guide covers advanced usage patterns, performance considerations, and known limitations.

## Type Variants

### WithDefaults (Standard)

The standard `WithDefaults` type performs deep merging and makes properties with defaults required:

```typescript
interface ConfigBase {
  theme?: string;
  debug?: boolean;
  settings?: {
    timeout?: number;
  };
}

type Config = WithDefaults<ConfigBase, {
  theme: "dark";
  settings: { timeout: 5000 };
}>;

// Result type:
// {
//   theme: "dark" | string;      // REQUIRED
//   debug?: boolean;              // Still optional
//   settings: {                   // REQUIRED
//     timeout: 5000 | number;     // REQUIRED
//   };
// }
```

### PartialWithDefaults

Keeps all properties optional while showing defaults in IntelliSense:

```typescript
type PartialConfig = PartialWithDefaults<ConfigBase, {
  theme: "dark";
  debug: false;
}>;

// All properties remain optional but show defaults:
// {
//   theme?: "dark" | string;
//   debug?: false | boolean;
//   settings?: { timeout?: number };
// }

const config: PartialConfig = {}; // Valid!
```

### ShallowWithDefaults

Non-recursive version for better performance with large flat objects:

```typescript
type ShallowConfig = ShallowWithDefaults<ConfigBase, {
  theme: "dark";
  settings: { timeout: 5000, retries: 3 };
}>;

// Only merges at top level:
// {
//   theme: "dark" | string;
//   debug?: boolean;
//   settings: { timeout: 5000, retries: 3 }; // Replaced entirely
// }
```

### StrictWithDefaults

Requires defaults for ALL properties:

```typescript
// This causes a type error - missing 'debug' default
type StrictConfig = StrictWithDefaults<ConfigBase, {
  theme: "dark";
  // Error: Property 'debug' is missing
}>;

// This works - all properties have defaults
type StrictConfig = StrictWithDefaults<ConfigBase, {
  theme: "dark";
  debug: false;
  settings: { timeout: 5000 };
}>;
```

## Performance Considerations

### TypeScript Recursion Limits

TypeScript has a maximum instantiation depth of approximately 50 levels. For deeply nested types:

```typescript
// This may hit recursion limits
interface DeeplyNested {
  level1?: {
    level2?: {
      // ... 50+ levels deep
    };
  };
}

// Consider using ShallowWithDefaults for better performance
type Config = ShallowWithDefaults<DeeplyNested, defaults>;
```

### Compilation Performance

For optimal compilation performance:

1. Use `ShallowWithDefaults` for objects with 100+ properties
2. Avoid excessive nesting (>10 levels)
3. Consider splitting large configurations into smaller modules

## Known Limitations

### 1. Symbol Keys Not Supported

Symbol keys are not processed by the deep merge:

```typescript
const sym = Symbol('key');
interface Config {
  [sym]?: string;
  regular?: string;
}

// Symbol properties keep their default values
const result = applyDefaults(
  { [sym]: "default", regular: "default" },
  { [sym]: "custom", regular: "custom" }
);
// result[sym] === "default" (not merged)
// result.regular === "custom" (merged correctly)
```

### 2. Class Instances Become Plain Objects

Class instances lose their prototype chain:

```typescript
class CustomDate {
  constructor(public value: number) {}
  toString() { return `Date(${this.value})`; }
}

const result = applyDefaults(
  { date: new CustomDate(1) },
  { date: new CustomDate(2) }
);
// result.date is { value: 2 } - not a CustomDate instance
```

### 3. Date and RegExp Objects

Date and RegExp objects become empty objects during merge:

```typescript
const result = applyDefaults(
  { date: new Date(), pattern: /test/ },
  { date: new Date('2024-01-01') }
);
// result.date === {} (empty object)
// result.pattern === {} (empty object)
```

**Recommendation**: Replace these types entirely instead of merging.

### 4. Discriminated Unions

Properties from different union variants get incorrectly merged:

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number };

const result = applyDefaults(
  { shape: { kind: "circle", radius: 10 } },
  { shape: { kind: "square", size: 20 } }
);
// result.shape has both radius AND size (incorrect!)
```

**Recommendation**: Replace discriminated union values entirely.

### 5. Readonly Properties

The `readonly` modifier is not preserved in the merged type:

```typescript
interface Config {
  readonly apiKey?: string;
}

type Merged = WithDefaults<Config, { apiKey: "default" }>;
// apiKey is no longer readonly in Merged
```

### 6. Circular References

Circular references will cause stack overflow:

```typescript
// DON'T DO THIS
const config: any = { name: "test" };
config.self = config; // Circular reference

// This will cause stack overflow
const result = applyDefaults(defaults, config);
```

## Best Practices

### 1. Use Type-Safe Defaults

Always use `as const` for literal types:

```typescript
const defaults = {
  theme: "dark" as const,
  mode: "production" as const,
} satisfies ConfigBase;
```

### 2. Separate Runtime and Type Concerns

```typescript
// Type definition
type Config = WithDefaults<ConfigBase, typeof defaults>;

// Runtime helper
const createConfig = withDefaults<ConfigBase>(defaults);

// Usage
const config = createConfig({ theme: "light" });
```

### 3. Handle Special Types Explicitly

For Date, RegExp, and class instances:

```typescript
interface Config {
  startDate?: Date;
  settings?: Settings;
}

// Apply defaults separately for special types
const config = {
  ...applyDefaults(defaults, props),
  startDate: props.startDate ?? new Date(),
};
```

### 4. Use Appropriate Variant

- Use `WithDefaults` for configuration objects where defaults should be guaranteed
- Use `PartialWithDefaults` for optional enhancement (like React component props)
- Use `ShallowWithDefaults` for performance-critical flat objects
- Use `StrictWithDefaults` when all properties must have defaults

## Migration Guide

### From Plain Defaults

```typescript
// Before
const config = { ...defaults, ...userConfig };

// After - with type safety
type Config = WithDefaults<ConfigType, typeof defaults>;
const config = applyDefaults(defaults, userConfig);
```

### From Utility Types

```typescript
// Before
type Config = Required<ConfigBase> & Partial<UserConfig>;

// After - with IntelliSense for defaults
type Config = WithDefaults<ConfigBase, ConfigDefaults>;
```

## TypeScript Configuration

For best results, ensure your `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noUncheckedIndexedAccess": true
  }
}
```

## Troubleshooting

### "Type instantiation is excessively deep"

Solution: Use `ShallowWithDefaults` or reduce nesting depth.

### "Type 'X' does not satisfy the constraint"

Solution: Ensure your defaults type extends `DeepPartial<T>` of your base type.

### Runtime values don't match types

Solution: Always use the runtime helpers (`withDefaults`/`applyDefaults`) - the type alone doesn't apply defaults.
