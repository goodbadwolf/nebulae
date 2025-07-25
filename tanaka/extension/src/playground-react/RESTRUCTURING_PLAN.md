# Playground-React to React Router Migration Plan

## Overview

This document outlines the plan to migrate from a multi-entry architecture to a single-page application using React Router.
This eliminates the need to modify `rsbuild.config.ts` every time we add a new route.

## Goals

1. Single entry point for all routes
2. No build configuration changes when adding routes
3. Standard React patterns with React Router
4. Maintain all existing functionality
5. Easy addition of future routes
6. **Every commit must pass build, lint, and typecheck**

## Important Notes

### Tech Stack (DO NOT REMOVE)

- **Mantine UI**: The playground-react uses Mantine components and styling
- **React**: All components are React-based
- **React Router**: For client-side routing
- **SCSS**: Styles use SCSS with Mantine CSS variables
- **TypeScript**: Full TypeScript support

### Files to Keep

- `MANTINE-CSS-VARS.md` - Reference documentation for Mantine CSS variables
- All Mantine imports and MantineProvider usage
- `_mantine_vars.scss` - Custom Mantine variable overrides
- All existing component libraries and dependencies

## Current Issues with Multi-Entry Architecture

- Must modify `rsbuild.config.ts` for each new route
- Separate HTML files and entry points for each route
- No shared state or navigation between routes
- Duplicated initialization code
- Complex build configuration

## Target Architecture

```text
playground-react/
├── index.html            # Single HTML template
├── index.tsx            # Single entry point
├── App.tsx              # Router setup and layout
├── pages/               # Page components
│   ├── HomePage.tsx     # Main playground (from current home)
│   ├── WelcomePage.tsx  # Welcome wizard
│   ├── SettingsPage.tsx # Settings (future)
│   └── ManagerPage.tsx  # Tab manager (future)
├── components/          # Shared components (unchanged)
├── styles/             # Global styles
│   ├── globals.scss
│   ├── _mantine_vars.scss
│   └── _tanaka_vars.scss
├── utils/              # Utilities (unchanged)
└── types.d.ts          # TypeScript declarations
```

## Migration Steps (Small Commits)

### Commit 1: Install Dependencies

```bash
cd extension
pnpm add react-router-dom
pnpm add -D @types/react-router-dom
```

**Verify**: `pnpm run build && pnpm run lint && pnpm run typecheck`  
**Commit**: `feat(tanaka): add react-router-dom dependencies`

### Commit 2: Create App.tsx with Router (Alongside Existing)

Create `src/playground-react/App.tsx` that uses existing pages.
This won't break anything as it's not used yet.

### Commit 3: Create New Entry Point (Alongside Existing)

Create new `src/playground-react/main.tsx` as the single entry.
Still not breaking as we haven't updated build config.

### Commit 4: Update Build Config to Use New Entry

Update `rsbuild.config.ts` to use the new single entry.
Remove old entries. Update template config.

### Commit 5: Clean Up Old Structure

Remove `routes/` directory and old entry files.
Update imports in pages to not depend on routes.

## Detailed Implementation

### App.tsx Structure

```typescript
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { HomePage } from "./pages/home";
import { WelcomePage } from "./pages/welcome";

export function App() {
  return (
    <MantineProvider>
      <BrowserRouter basename="/playground-rt">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
```

### Single Entry Point (main.tsx)

```typescript
import "./styles/globals.scss";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);
root.render(<App />);
```

### HTML Template (index.html)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tanaka Playground</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

### RSBuild Config Changes

```typescript
// Single entry instead of multiple
"playground-rt": {
  import: "./src/playground-react/main.tsx",
  html: true,
},

// Simplified template function
template({ entryName }) {
  const templates: Record<string, string> = {
    popup: "./src/popup/index.html",
    "playground-rt": "./src/playground-react/index.html",
    // ... other entries
  };
  return templates[entryName] || "./src/popup/index.html";
},
// Remove templateParameters entirely
```

### Dev Server Update for SPA

Since we're moving to SPA, the dev server needs to handle client-side routing:

```typescript
// In dev server config, add fallback for SPA routes
dev: {
  writeToDisk: true,
  hmr: true,
  liveReload: true,
  // Add this for SPA routing:
  historyApiFallback: {
    index: '/playground-rt/index.html',
    rewrites: [
      { from: /^\/playground-rt/, to: '/playground-rt/index.html' }
    ]
  }
}
```

## Benefits

1. **No Config Changes**: Add routes without touching `rsbuild.config.ts`
2. **Standard Pattern**: React Router is the React standard
3. **Shared State**: Easy to share state/context between pages
4. **Navigation**: Built-in navigation components
5. **Code Splitting**: Can add lazy loading later
6. **URL Support**: Browser back/forward buttons work
7. **Development Speed**: Faster to add new features

## Adding New Routes (Post-Migration)

After migration, adding a new route is simple:

1. Create new page component: `pages/NewPage.tsx`
2. Add route to `App.tsx`:

   ```typescript
   <Route path="/new" element={<NewPage />} />
   ```

3. Done! No build config changes needed.

## Migration Checklist

- [ ] Install react-router-dom
- [ ] Revert current multi-entry structure  
- [ ] Create single entry point (index.tsx)
- [ ] Create App.tsx with router setup
- [ ] Create single HTML template
- [ ] Convert existing pages to router pages
- [ ] Update rsbuild.config.ts to single entry
- [ ] Test all routes work correctly
- [ ] Add navigation components if needed
- [ ] Document new patterns

## Rollback Plan

If issues occur, the git history has the full multi-entry implementation that can be restored.
