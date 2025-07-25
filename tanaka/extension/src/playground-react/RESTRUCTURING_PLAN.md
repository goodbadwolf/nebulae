# Playground-React Restructuring Plan

## Overview

This document outlines the complete plan for restructuring the playground-react directory to improve organization,
reduce confusion, and prepare for future expansion.

## Goals

1. Create clear separation between entry points and page components
2. Eliminate redundant files and directories
3. Standardize on consistent patterns
4. Prepare for easy addition of new routes (settings, manager)
5. Use a single HTML template to reduce duplication

## Important Notes

### Tech Stack (DO NOT REMOVE)

- **Mantine UI**: The playground-react uses Mantine components and styling
- **React**: All components are React-based
- **SCSS**: Styles use SCSS with Mantine CSS variables
- **TypeScript**: Full TypeScript support

### Files to Keep

- `MANTINE-CSS-VARS.md` - Reference documentation for Mantine CSS variables
- All Mantine imports and MantineProvider usage
- `_mantine_vars.scss` - Custom Mantine variable overrides
- All existing component libraries and dependencies

## Current Structure Issues

- Entry points (`index.tsx`, `welcome.tsx`) mixed with HTML templates at root
- Confusing `app/` directory with both component and re-export
- Inconsistent root element IDs (`playground-root` vs `root`)
- HTML templates duplicated for each entry
- Documentation file in styles directory

## Target Structure

```text
playground-react/
├── template.html                 # Single shared HTML template
├── routes/                       # All entry points (similar to playground-js/*.ts)
│   ├── index.tsx                # Main playground route
│   ├── welcome.tsx              # Welcome page route
│   ├── settings.tsx             # (future) Settings route  
│   └── manager.tsx              # (future) Manager route
├── pages/                        # Page components
│   ├── home/                    # Main playground page
│   │   ├── home.tsx            # Renamed from app.tsx
│   │   ├── home.scss           # Renamed from app.scss
│   │   └── index.ts            # Export barrel
│   └── welcome/                 # Existing welcome page
│       ├── welcome.tsx
│       ├── welcome.scss
│       ├── index.ts
│       └── components/
├── components/                   # Shared components (unchanged)
├── styles/                      # Global styles (similar to playground-js/styles/)
│   ├── globals.scss
│   ├── _mantine_vars.scss
│   └── _tanaka_vars.scss
├── utils/                       # Utilities (unchanged)
└── types.d.ts                  # TypeScript declarations
```

**Key Differences from playground-js:**

- Single shared `template.html` vs individual HTML files per route
- Component-based architecture with `pages/` directory
- SCSS instead of CSS for styling
- React components vs vanilla JS

## Detailed Implementation Steps

### Chunked Implementation Plan

**IMPORTANT**: Each chunk must result in a working build with no TypeScript or lint errors. The chunks are ordered to
maintain a working state at every commit.

---

### Chunk 1: Create Directory Structure & Prepare Home Page

**Goal**: Set up new structure with home page components (without breaking existing code)

```bash
mkdir -p src/playground-react/routes
mkdir -p src/playground-react/pages/home
```

#### 1.1 Copy app files to new location (don't move yet)

```bash
cp src/playground-react/app/app.tsx src/playground-react/pages/home/home.tsx
cp src/playground-react/app/app.scss src/playground-react/pages/home/home.scss
```

#### 1.2 Update the copied files

**Edit**: `src/playground-react/pages/home/home.tsx`

```typescript
// Line 1: Update import path
- import "../styles/globals.scss";
+ import "../../styles/globals.scss";

// Line 2: Update import filename
- import "./app.scss";
+ import "./home.scss";

// Line 60: Rename component
- export function PlaygroundApp() {
+ export function HomePage() {
```

#### 1.3 Create barrel export

**Create**: `src/playground-react/pages/home/index.ts`

```typescript
export { HomePage } from "./home";
```

#### 1.4 Update app/index.tsx to export both names temporarily

**Edit**: `src/playground-react/app/index.tsx`

```typescript
export { PlaygroundApp } from "./app";
export { HomePage } from "../pages/home";
```

**Build & Test**: `pnpm run build` - should pass with no errors

**Commit message**: `refactor(tanaka): prepare home page structure alongside existing app`

---

### Chunk 2: Create Routes and Update Imports

**Goal**: Set up routes directory with updated entry points (still using old HTML files)

#### 2.1 Copy entry files to routes (don't move yet)

```bash
cp src/playground-react/index.tsx src/playground-react/routes/index.tsx
cp src/playground-react/welcome.tsx src/playground-react/routes/welcome.tsx
```

#### 2.2 Update the copied files

**Edit**: `src/playground-react/routes/index.tsx`

```typescript
// Line 3: Update import to use HomePage
- import { PlaygroundApp } from "./app";
+ import { HomePage } from "../pages/home";

// Line 11: Update component name
- root.render(<PlaygroundApp />);
+ root.render(<HomePage />);
```

**Edit**: `src/playground-react/routes/welcome.tsx`

```typescript
// Line 1: Update import path
- import "./styles/globals.scss";
+ import "../styles/globals.scss";

// Line 5: Update import path
- import { WelcomePage } from "./pages/welcome";
+ import { WelcomePage } from "../pages/welcome";
```

**Build & Test**: `pnpm run build` - should still pass

**Commit message**: `refactor(tanaka): create routes directory with updated entry points`

---

### Chunk 3: Update RSBuild Configuration and Switch to New Structure

**Goal**: Update build config to use new entry points and remove old files

#### 3.1 Update rsbuild.config.ts

```typescript
// Lines ~56-63
"playground-rt/index": {
-  import: "./src/playground-react/index.tsx",
+  import: "./src/playground-react/routes/index.tsx",
   html: true,
},
"playground-rt/welcome": {
-  import: "./src/playground-react/welcome.tsx",
+  import: "./src/playground-react/routes/welcome.tsx",
   html: true,
},
```

#### 3.2 Delete old files (now safe to remove)

```bash
rm src/playground-react/index.tsx
rm src/playground-react/welcome.tsx
rm -rf src/playground-react/app/
```

**Build & Test**: `pnpm run build` - should build successfully
**Lint**: `pnpm run lint` - should pass

**Commit message**: `refactor(tanaka): switch to new routes structure and clean up old files`

---

### Chunk 4: Create Shared Template

**Goal**: Add shared HTML template (HTML files still work during transition)

**Create**: `src/playground-react/template.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%= title %></title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

**Note**: Old HTML files still exist and work at this point

**Commit message**: `feat(tanaka): add shared HTML template for playground-react`

---

### Chunk 5: Update Routes to Use Correct Root ID

**Goal**: Fix root element ID mismatch before switching templates

**Edit**: `src/playground-react/routes/index.tsx`

```typescript
// Line 5: Change root element ID
- const container = document.getElementById("playground-root");
+ const container = document.getElementById("root");
```

**Build & Test**: `pnpm run build` - builds successfully
**Note**: App won't work in browser yet due to ID mismatch with old HTML

**Commit message**: `fix(tanaka): update root element ID to match new template`

---

### Chunk 6: Switch to Shared Template and Remove Old HTML

**Goal**: Complete the template migration

#### 6.1 Update rsbuild.config.ts

```typescript
// Inside html config, ~line 92
template({ entryName }) {
+  // Use single template for all playground-react routes
+  if (entryName.startsWith('playground-rt/')) {
+    return "./src/playground-react/template.html";
+  }
+  
   const templates: Record<string, string> = {
     popup: "./src/popup/index.html",
     "playground-js/index": "./src/playground-js/index.html",
     "playground-js/popup": "./src/playground-js/popup.html",
     "playground-js/welcome": "./src/playground-js/welcome.html",
     "playground-js/settings": "./src/playground-js/settings.html",
     "playground-js/manager": "./src/playground-js/manager.html",
-    "playground-rt/index": "./src/playground-react/index.html",
-    "playground-rt/welcome": "./src/playground-react/welcome.html",
   };
   return templates[entryName] || "./src/popup/index.html";
},
+templateParameters(params) {
+  const titles: Record<string, string> = {
+    'playground-rt/index': 'Tanaka React Playground',
+    'playground-rt/welcome': 'Welcome to Tanaka',
+    'playground-rt/settings': 'Tanaka Settings',  // Future
+    'playground-rt/manager': 'Tanaka Manager',    // Future
+  };
+  return {
+    title: titles[params.entryName] || 'Tanaka',
+  };
+},
```

#### 6.2 Delete old HTML files

```bash
rm src/playground-react/index.html
rm src/playground-react/welcome.html
```

**Build & Test**: `pnpm run build && pnpm run lint` - all pass
**Browser Test**: App now works with new structure

**Commit message**: `feat(tanaka): implement shared template with dynamic titles`

---

### Chunk 7: Handle Documentation File

**Goal**: Review misplaced documentation

```bash
# Review the file first
cat src/playground-react/styles/MANTINE-CSS-VARS.md

# KEEP THIS FILE - it contains Mantine CSS variable reference
# The playground-react still uses Mantine UI (see MantineProvider in components)
# This documentation is useful for styling work
```

**Note**: MANTINE-CSS-VARS.md should be kept as playground-react actively uses Mantine UI framework.

**Commit message**: Skip this chunk - documentation is still relevant

---

### Final Verification

**Not a commit, just verification steps**:

1. Run full build: `pnpm run build`
2. Run linters: `pnpm run lint`
3. Run type check: `pnpm run typecheck`
4. Test both routes in browser
5. Verify styles and dark mode work

## Verification Steps

1. **Build the project**:

   ```bash
   pnpm run build
   ```

2. **Check generated files exist**:

   - `dist/playground-rt/index/index.html`
   - `dist/playground-rt/welcome/index.html`

3. **Verify HTML content**:

   - Both should have `<div id="root">`
   - Titles should be correct

4. **Test in browser**:

   - `http://localhost:3000/playground-rt/` → Main playground
   - `http://localhost:3000/playground-rt/welcome/` → Welcome wizard

5. **Check for console errors**:

   - No missing imports
   - No runtime errors

6. **Verify styles**:

   - All components styled correctly
   - Dark mode working

## Rollback Plan

If issues occur:

```bash
# Restore all files
git restore .

# Remove new directories
rm -rf src/playground-react/routes
rm -rf src/playground-react/pages/home
rm -f src/playground-react/template.html
```

When adding new routes (settings, manager):

1. Create entry point:

   ```typescript
   // routes/settings.tsx
   import "../styles/globals.scss";
   import { createRoot } from "react-dom/client";
   import { SettingsPage } from "../pages/settings";

   const container = document.getElementById("root");
   if (!container) {
     throw new Error("Root element not found");
   }

   const root = createRoot(container);
   root.render(<SettingsPage />);
   ```

2. Create page component in `pages/settings/`

3. Add to rsbuild.config.ts:

   ```typescript
   "playground-rt/settings": {
     import: "./src/playground-react/routes/settings.tsx",
     html: true,
   },
   ```

4. Title already configured in templateParameters

## Benefits of New Structure

1. **Clear separation**: Routes vs Pages vs Components (similar to playground-js entry points)
2. **Single source of truth**: One HTML template (improvement over playground-js pattern)
3. **Consistent patterns**: All pages follow same structure
4. **Scalable**: Easy to add new routes (settings, manager) to match playground-js
5. **Less confusion**: No more `app/` ambiguity
6. **Standard root ID**: Eliminates bugs from ID mismatch
7. **Cleaner root**: No HTML files in source directory
8. **Better than playground-js**: Shared template reduces duplication

## Timeline

- Estimated time: 30 minutes
- Complexity: Medium
- Testing time: 15 minutes

## Checklist

- [ ] Create routes/ directory
- [ ] Create pages/home/ directory
- [ ] Create template.html
- [ ] Move and update index.tsx
- [ ] Move and update welcome.tsx
- [ ] Move and rename app files
- [ ] Create home/index.ts
- [ ] Delete app/index.tsx
- [ ] Delete app/ directory
- [ ] Delete HTML files
- [ ] Handle MANTINE-CSS-VARS.md
- [ ] Update rsbuild.config.ts
- [ ] Build project
- [ ] Test both routes
- [ ] Verify no console errors
- [ ] Check styles work
- [ ] Commit changes
