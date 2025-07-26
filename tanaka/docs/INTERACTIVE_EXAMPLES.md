# Interactive React Component Demo with Template Loading

## Overview

This guide shows how to build an interactive component demo system that loads template files as strings, replaces
template variables, and renders them dynamically in TypeScript + React with rsbuild.

## Key Issues with the Original Approach

1. **Build Tool Compatibility**: The `?raw` import syntax is Vite-specific. Rsbuild requires different configuration.
2. **Security Concerns**: Using `new Function()` with dynamic code is risky.
3. **Type Safety**: Missing TypeScript types throughout.
4. **Module Resolution**: The manual `require` implementation is fragile.
5. **Error Handling**: No error boundaries or validation.

## Recommended Solution

### 1. Configure Rsbuild for Raw File Imports

```typescript
// rsbuild.config.ts
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    loaders: [
      {
        test: /\.template\.(tsx?|jsx?)$/,
        type: 'asset/source',
      },
    ],
  },
});
```

### 2. Type Declarations for Raw Imports

```typescript
// types/templates.d.ts
declare module '*.template.tsx' {
  const content: string;
  export default content;
}

declare module '*.template.ts' {
  const content: string;
  export default content;
}
```

### 3. Template File Structure

```typescript
// templates/ButtonExample.template.tsx
import React from 'react';
import { MyButton } from '../components/MyButton';

export default function Example() {
  return (
    <MyButton
      color="{{color}}"
      size="{{size}}"
      onClick={() => console.log('{{label}} clicked!')}
    >
      {{label}}
    </MyButton>
  );
}
```

Note: Using `{{}}` instead of `${}` to avoid conflicts with template literals.

### 4. Safe Template Interpolation System

```typescript
// utils/templateEngine.ts
interface TemplateVars {
  [key: string]: string | number | boolean;
}

export function interpolateTemplate(
  template: string,
  vars: TemplateVars
): string {
  // Validate template to prevent injection
  const allowedPattern = /\{\{(\w+)\}\}/g;

  return template.replace(allowedPattern, (match, key) => {
    const value = vars[key];
    if (value === undefined) {
      console.warn(`Template variable '${key}' not found`);
      return match;
    }

    // Escape values for safety
    return String(value).replace(/[<>]/g, '');
  });
}

// Validate that interpolated code is safe
export function validateInterpolatedCode(code: string): boolean {
  // Check for dangerous patterns
  const dangerousPatterns = [
    /eval\s*\(/,
    /new\s+Function/,
    /__proto__/,
    /constructor\s*\[/,
  ];

  return !dangerousPatterns.some(pattern => pattern.test(code));
}
```

### 5. Component Preview System Using react-live

```bash
pnpm add react-live @types/react-live
```

```typescript
// components/InteractiveDemo.tsx
import React, { useState, useMemo } from 'react';
import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live';
import * as Babel from '@babel/standalone';
import { interpolateTemplate, validateInterpolatedCode } from '../utils/templateEngine';

// Import your components that will be available in the sandbox
import { MyButton } from './MyButton';

// Import template as string
import buttonTemplate from '../templates/ButtonExample.template.tsx';

interface DemoProps {
  template?: string;
  defaultVars?: Record<string, any>;
  scope?: Record<string, any>;
}

export function InteractiveDemo({
  template = buttonTemplate,
  defaultVars = {},
  scope = {}
}: DemoProps) {
  const [vars, setVars] = useState({
    color: 'primary',
    size: 'medium',
    label: 'Click me',
    ...defaultVars
  });

  const interpolatedCode = useMemo(() => {
    const code = interpolateTemplate(template, vars);
    if (!validateInterpolatedCode(code)) {
      throw new Error('Invalid template code detected');
    }
    return code;
  }, [template, vars]);

  // Combine default scope with custom scope
  const fullScope = {
    React,
    MyButton,
    ...scope
  };

  return (
    <div className="interactive-demo">
      <div className="controls">
        <h3>Props Controller</h3>
        <div className="control-group">
          <label>
            Color:
            <select
              value={vars.color}
              onChange={(e) => setVars({ ...vars, color: e.target.value })}
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="danger">Danger</option>
            </select>
          </label>
        </div>

        <div className="control-group">
          <label>
            Size:
            <select
              value={vars.size}
              onChange={(e) => setVars({ ...vars, size: e.target.value })}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </label>
        </div>

        <div className="control-group">
          <label>
            Label:
            <input
              type="text"
              value={vars.label}
              onChange={(e) => setVars({ ...vars, label: e.target.value })}
            />
          </label>
        </div>
      </div>

      <LiveProvider
        code={interpolatedCode}
        scope={fullScope}
        transformCode={(code) => {
          // Transform TypeScript to JavaScript
          return Babel.transform(code, {
            presets: ['react', 'typescript'],
            filename: 'example.tsx'
          }).code || '';
        }}
      >
        <div className="preview-section">
          <h3>Live Preview</h3>
          <div className="preview-container">
            <LiveError />
            <LivePreview />
          </div>
        </div>

        <div className="code-section">
          <h3>Code</h3>
          <LiveEditor />
        </div>
      </LiveProvider>
    </div>
  );
}
```

### 6. Alternative: Custom Sandboxed Renderer (Without react-live)

```typescript
// components/SafeRenderer.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Babel from '@babel/standalone';

interface Props {
  code: string;
  scope: Record<string, any>;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Component render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-display">
          <h4>Render Error</h4>
          <pre>{this.state.error?.message}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export function SafeRenderer({ code, scope }: Props) {
  try {
    // Transform TypeScript/JSX to JavaScript
    const transformedCode = Babel.transform(code, {
      presets: ['react', 'typescript'],
      filename: 'virtual.tsx',
    }).code;

    if (!transformedCode) {
      throw new Error('Failed to transform code');
    }

    // Create a sandboxed function
    const scopeKeys = Object.keys(scope);
    const scopeValues = scopeKeys.map(key => scope[key]);

    // Wrap in IIFE to return the component
    const wrappedCode = `
      ${transformedCode}
      return Example;
    `;

    // Create function with explicit scope
    const createComponent = new Function(...scopeKeys, wrappedCode);
    const Component = createComponent(...scopeValues);

    return (
      <ErrorBoundary>
        <Component />
      </ErrorBoundary>
    );
  } catch (error) {
    return (
      <div className="error-display">
        <h4>Compilation Error</h4>
        <pre>{error instanceof Error ? error.message : 'Unknown error'}</pre>
      </div>
    );
  }
}
```

### 7. Complete Usage Example

```typescript
// pages/ComponentDemo.tsx
import React from 'react';
import { InteractiveDemo } from '../components/InteractiveDemo';
import { MyButton, MyCard, MyInput } from '../components';

// Import multiple templates
import buttonTemplate from '../templates/ButtonExample.template.tsx';
import cardTemplate from '../templates/CardExample.template.tsx';

export function ComponentDemoPage() {
  return (
    <div className="demo-page">
      <h1>Component Library Interactive Examples</h1>

      <section>
        <h2>Button Component</h2>
        <InteractiveDemo
          template={buttonTemplate}
          defaultVars={{
            color: 'primary',
            size: 'medium',
            label: 'Click me!'
          }}
          scope={{ MyButton }}
        />
      </section>

      <section>
        <h2>Card Component</h2>
        <InteractiveDemo
          template={cardTemplate}
          defaultVars={{
            title: 'Card Title',
            content: 'Card content goes here'
          }}
          scope={{ MyCard }}
        />
      </section>
    </div>
  );
}
```

### 8. Styling for Better UX

```css
/* styles/interactive-demo.css */
.interactive-demo {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.controls {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
}

.control-group {
  margin-bottom: 1rem;
}

.control-group label {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.preview-section {
  margin-bottom: 2rem;
}

.preview-container {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
}

.code-section pre {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}

.error-display {
  background: #fee;
  color: #c00;
  padding: 1rem;
  border-radius: 4px;
}
```

## Best Practices

1. **Security First**: Always validate and sanitize template variables
2. **Type Safety**: Use TypeScript interfaces for all props and template variables
3. **Error Handling**: Implement proper error boundaries and validation
4. **Performance**: Memoize expensive operations like code transformation
5. **User Experience**: Provide clear error messages and loading states

## Alternative Libraries to Consider

- **react-live**: Production-ready live code editing (recommended)
- **@codesandbox/sandpack-react**: Full IDE-like experience
- **react-runner**: Lightweight alternative with good TypeScript support

## Production Considerations

1. **Bundle Size**: Babel standalone is large (~2MB). Consider server-side transformation for production.
2. **Content Security Policy**: May need adjustments for dynamic code execution
3. **Accessibility**: Ensure controls are keyboard navigable and screen reader friendly
4. **Testing**: Write tests for template interpolation and security validation
