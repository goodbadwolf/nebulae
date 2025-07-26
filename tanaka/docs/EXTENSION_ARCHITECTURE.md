# Playground Architecture

## Overview

The playground is a development and showcase environment for Tanaka extension components. It provides a safe space to
test UI components with mock data, prototype new features, and document component patterns.

## Goals

1. **Component Development** - Isolated environment for building and testing components
2. **Living Documentation** - Showcase of all extension UI patterns and components
3. **Safe Experimentation** - Test with mock data without affecting production settings
4. **Rapid Prototyping** - Quick iteration on new features before integration

## Architecture

### URL Structure

- `/playground` - Main playground with navigation
- `/playground#pages` - Extension pages showcase
- `/playground#components` - Component library
- `/playground#experiments` - Experimental features
- `/playground/welcome` - Welcome page with mock services
- `/playground/settings` - Settings page with mock services
- `/playground/manager` - Manager page with mock services

### Directory Structure

```text
src/
├── core/                    # Shared interfaces and utilities (TBD structure)
├── di/                      # Dependency injection system
│   ├── IServiceProvider.ts
│   ├── ServicesContainer.ts
│   ├── ServicesContext.tsx
│   └── withServicesContainer.tsx
├── components/              # Generic, reusable components
│   ├── theme-provider/
│   ├── page-shell/
│   ├── icon/
│   ├── app-logo/
│   ├── responsive-grid/
│   └── card/
├── storage/                 # Storage service implementations
│   ├── IStorageProvider.ts
│   ├── BrowserStorageProvider.ts
│   └── MockStorageProvider.ts
├── api/                     # API service implementations
│   ├── IAPIProvider.ts
│   ├── ServerAPIProvider.ts
│   └── MockAPIProvider.ts
├── welcome/                 # Welcome page (separate entry)
│   ├── index.html
│   ├── index.tsx
│   └── App.tsx
├── playground/              # Playground application
│   ├── index.html
│   ├── index.tsx
│   ├── App.tsx            # Main app with routing
│   ├── sections/          # Playground sections
│   │   ├── PagesSection.tsx
│   │   ├── ComponentsSection.tsx
│   │   └── ExperimentsSection.tsx
│   ├── components/        # Playground-specific components
│   │   ├── navigation/
│   │   ├── debug-toolbar/
│   │   └── examples-scanner/
│   └── styles/
└── settings/              # Settings page (separate entry)
    └── ... (similar structure)
```

## Key Features

### 1. Service Provider System

Dependency injection system allowing runtime switching between real and mock implementations:

```typescript
// Production
export default withServicesContainer(App, {
  storage: new BrowserStorageProvider(),
  api: new ServerAPIProvider()
});

// Playground
export default withServicesContainer(App, {
  storage: new MockStorageProvider(),
  api: new MockAPIProvider()
});
```

### 2. Debug Toolbar

Floating toolbar with compact and expanded modes:

- Service provider switchers (Storage, API, etc.)
- Theme switcher
- Mock data scenarios
- State inspector
- Performance tools

### 3. Component Examples Pattern

Each component can provide examples via `*.examples.tsx` files:

```typescript
// components/button/button.examples.tsx
export const config = {
  title: 'Button',
  description: 'Interactive button component',
  tags: ['ui', 'interactive']
};

export function StaticExamplesContainer() {
  // Gallery of button variations
}

// Future: InteractiveExamplesContainer with templates
```

### 4. Navigation System

Sidebar navigation using Mantine AppShell:

- Collapsible sections for organization
- Hash-based routing for bookmarkable URLs
- Responsive behavior for mobile

## Design Decisions

### CSS Architecture

- **Use Mantine defaults** - No custom design system
- **Minimal overrides** - Only when necessary
- **Component styles** - Scoped to components
- **ThemeProvider** - Centralized theme configuration

### Component Organization

- **Flat structure** - Easy to find components
- **Clear separation** - Generic vs playground-specific
- **Self-contained** - Each component with its examples

### Routing Strategy

- **Hash routing** - For playground sections
- **Separate entries** - For full-page previews
- **Clean URLs** - `/playground#components` not `/playground#/components`

## Future Enhancements

### Interactive Examples with Templates

Advanced interactive component demos using template files:

- Template-based examples with variable interpolation
- Live code editing with react-live
- Safe execution environment
- Props control panel

See "FUTURE WORK: Interactive Examples with Templates" section for implementation details.

### Additional Features

- Component search
- Props documentation generator
- Visual regression testing
- Performance benchmarks
- Accessibility audit tools

## Core/Shared Module Structure (TBD)

Three options under consideration:

**Option A**: Just interfaces and types
**Option B**: Include utilities and constants too  
**Option C**: Include theme here too

Decision pending based on project needs.

## Playground Entry Points Structure (TBD)

Three options under consideration:

**Option A**: Separate entry files
**Option B**: Shared playground wrapper
**Option C**: Route-based entry generator

Decision pending based on maintainability preferences.
