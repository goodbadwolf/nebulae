# Gradual Migration Plan: Playground to React + Mantine v8

## Overview

Migrate the Tanaka playground from vanilla HTML/CSS/TypeScript to React + Mantine v8, using SCSS modules and maintaining
BEM conventions while leveraging Mantine's component library.

## Core Principles

- **No CSS-in-JS** - Use SCSS and CSS Modules exclusively for better performance
- **Maintain BEM conventions** - Continue using BEM naming within CSS Modules for consistency
- **Gradual migration** - Both versions coexist during transition
- **Acceptable changes** - Minor visual updates are fine if they improve UX
- **Modular styling** - Each component has its own SCSS module file

## Phase 1: Infrastructure Setup

1. **Install Dependencies**
   - @mantine/core, @mantine/hooks, @mantine/notifications v8
   - React Router DOM
   - @phosphor-icons/react (matches existing design system)
   - sass (for SCSS support)
   - Ensure CSS Modules are configured in build system

2. **Create Parallel Structure**

   ```text
   extension/
   ├── src/
   │   ├── playground/          # Current vanilla (keep working)
   │   └── playground-react/    # New React implementation
   │       ├── components/      # Shared React components
   │       │   ├── Button/
   │       │   │   ├── Button.tsx
   │       │   │   └── Button.module.scss
   │       │   └── Card/
   │       │       ├── Card.tsx
   │       │       └── Card.module.scss
   │       ├── pages/          # Page components
   │       │   └── Welcome/
   │       │       ├── Welcome.tsx
   │       │       └── Welcome.module.scss
   │       ├── styles/         # Global styles
   │       │   ├── _variables.scss
   │       │   └── globals.scss
   │       ├── theme.ts        # Mantine theme config
   │       └── App.tsx         # Main React app
   ```

3. **Build Configuration**
   - Add React playground entries to RSBuild
   - Configure SCSS loader with CSS Modules support
   - Environment toggle for vanilla vs React
   - Ensure `.module.scss` files are processed correctly

## Phase 2: Mantine Theme Setup

1. **Theme Configuration**

   Map existing design tokens from core.css to Mantine theme:

   ```typescript
   // theme.ts - Map existing Tanaka design tokens to Mantine
   import { createTheme } from '@mantine/core';
   import type { MantineColorsTuple } from '@mantine/core';

   const tanakaPrimary: MantineColorsTuple = [
     // Map --tnk-primary color variations
     '#f0f0ff', '#e0e2ff', '#c2c6ff', '#a0a6ff', '#8287ff',
     '#6366f1', // Main --tnk-primary: #6366f1
     '#4f46e5', // --tnk-primary-dark: #4f46e5
     '#4338ca', '#3730a3', '#312e81',
   ];

   const theme = createTheme({
     primaryColor: 'tanakaPrimary',
     colors: {
       tanakaPrimary,
       tanakaSecondary, // Map --tnk-secondary
       tanakaSuccess,   // Map --tnk-success: #10b981
       tanakaWarning,   // Map --tnk-warning: #f59e0b
       tanakaError,     // Map --tnk-error: #ef4444
     },
     fontFamily: 'var(--tnk-font-family)',
     fontSizes: {
       xs: 'var(--tnk-text-small)',  // 11px - metadata like "Last synced: 2 mins ago"
       sm: 'var(--tnk-text-mono)',   // 12px - monospace URLs, technical info
       md: 'var(--tnk-text-body)',   // 13px - body text (workspace names, tab counts)
       lg: 'var(--tnk-text-header)', // 14px - section headers like "My Workspaces"
       xl: 'var(--tnk-text-lg)',     // 16px - large text
     },
     spacing: {
       xs: 'var(--tnk-space-xs)',  // 4px
       sm: 'var(--tnk-space-sm)',  // 8px
       md: 'var(--tnk-space-md)',  // 12px
       lg: 'var(--tnk-space-lg)',  // 16px
       xl: 'var(--tnk-space-xl)',  // 24px
     },
     radius: {
       xs: 'var(--tnk-radius-sm)', // 2px
       sm: 'var(--tnk-radius-md)', // 4px
       md: 'var(--tnk-radius-lg)', // 6px
       lg: 'var(--tnk-radius-xl)', // 8px
       xl: 'var(--tnk-radius-2xl)', // 12px
     },
     shadows: {
       xs: 'var(--tnk-shadow-sm)',
       sm: 'var(--tnk-shadow-md)',
       md: 'var(--tnk-shadow-lg)',
       lg: 'var(--tnk-shadow-xl)',
     },
   });
   ```

2. **Design System Integration Strategy**
   - **CSS variable mapping**: Core.css has semantic variables (`--tnk-text-small`, `--tnk-text-body`) but some
   components use unmapped references (`--tnk-text-xs`, `--tnk-text-base`)
   - **Migration approach**: Fix variable inconsistencies as we migrate each component to React
   - **BEM structure maintained**: All existing `.tnk-*` classes preserved in SCSS modules
   - **Component enhancement**: Use Mantine for functionality, design system for styling
   - **Gradual fixes**: Address CSS variable gaps during component-by-component migration

## SCSS Modules & BEM Strategy

### File Naming Convention

- Component files: `ComponentName.tsx`
- Style files: `ComponentName.module.scss`
- Shared styles: `_variables.scss`, `_mixins.scss`

### BEM Within Modules

```scss
// Button.module.scss
.tnkButton {
  // Block styles

  &__text {
    // Element styles
  }

  &--primary {
    // Modifier styles
  }

  &--secondary {
    // Modifier styles
  }
}
```

### Usage in React

```tsx
// Button.tsx
import { Button as MantineButton } from '@mantine/core';
import styles from './Button.module.scss';

export const Button = ({ variant, children, ...props }) => {
  return (
    <MantineButton
      className={`${styles.tnkButton} ${styles[`tnkButton--${variant}`]}`}
      classNames={{
        label: styles.tnkButton__text
      }}
      {...props}
    >
      {children}
    </MantineButton>
  );
};
```

### Accessing Mantine Variables

```scss
// Use Mantine CSS variables in SCSS
.tnkCard {
  background: var(--mantine-color-body);
  border-radius: var(--mantine-radius-md);
  padding: var(--mantine-spacing-md);

  &--elevated {
    box-shadow: var(--mantine-shadow-md);
  }
}
```

## Phase 3: Component Migration Map

Map existing design system components to Mantine equivalents while preserving BEM structure:

| Design System Component | Mantine Component | SCSS Module Approach |
|------------------------|-------------------|---------------------|
| tnk-btn (variants: primary, secondary, ghost, danger) | Button | Keep existing `.tnk-btn` classes with modifiers |
| tnk-form-group | TextInput/Select | Preserve `.tnk-form-group__label`, `__input`, `__error` |
| tnk-card | Card/Paper | Maintain `.tnk-card__header`, `__body`, `__footer` |
| tnk-status-indicator | Badge/Indicator | Keep `.tnk-status-indicator--synced/syncing/error` |
| tnk-playground-container | Container/Stack | Preserve `.tnk-playground-container__header/layout` |
| tnk-popup-container | AppShell | Map to AppShell with existing `.tnk-popup-container` classes |
| tnk-workspace-list | Stack + Cards | Keep `.tnk-workspace-list--popup` modifier |
| tnk-search | TextInput | Maintain `.tnk-search__input`, `__icon`, `__clear` structure |
| tnk-empty-state | Custom component | Preserve `.tnk-empty-state__icon/title/description` |
| tnk-sidebar | AppShell.Navbar | Keep `.tnk-sidebar__section/item` BEM structure |

## Phase 4: Page Migration Strategy

### 1. Welcome Page

- Use Mantine's Container, Title, Text, Button
- Center layout with Stack
- Minimal custom styling needed

### 2. Settings Page

- Form with Mantine's form hooks
- TextInput, PasswordInput, Button components
- Built-in validation

### 3. Index Page

- SimpleGrid for page links
- Card components for each playground item
- Hover effects with SCSS modules

### 4. Popup Page

**Reference**: Follow popup layout specification from UI-DESIGN.md (lines 188-217)

```tsx
// Popup.tsx
import { AppShell, Group, Text, ActionIcon, TextInput, Stack, Badge, Card, Button, Center } from '@mantine/core';
import { Gear, MagnifyingGlass, X, PlayCircle, PlusCircle, Folder, FolderOpen } from '@phosphor-icons/react';
import styles from './Popup.module.scss';

export const Popup = () => {
  return (
    <div className={styles.tnkPopupContainer}>
      <AppShell className={styles.tnkPopupContainer__shell}>
        <AppShell.Header className={styles.tnkPopupContainer__header}>
          <Group justify="space-between">
            <Text className={styles.tnkPopupContainer__title} size="lg" fw={600}>
              Tanaka
            </Text>
            <ActionIcon
              variant="subtle"
              className={styles.tnkPopupContainer__settingsBtn}
              aria-label="Settings"
            >
              <Gear size={16} />
            </ActionIcon>
          </Group>
        </AppShell.Header>

        <AppShell.Main className={styles.tnkPopupContainer__body}>
          {/* Search bar with existing design system classes */}
          <div className={styles.tnkSearch}>
            <MagnifyingGlass className={styles.tnkSearch__icon} size={16} />
            <TextInput
              placeholder="Search workspaces and tabs..."
              className={styles.tnkSearch__input}
              classNames={{
                input: styles.tnkSearchInput__field
              }}
            />
            <ActionIcon className={styles.tnkSearch__clear} variant="subtle">
              <X size={16} />
            </ActionIcon>
          </div>

          {/* Workspace list following existing BEM structure */}
          <div className={styles.tnkPopupContainer__section}>
            <Text className={styles.tnkPopupContainer__sectionTitle} size="sm" fw={500}>
              My Workspaces
            </Text>
            <div className={styles.tnkWorkspaceList}>
              {workspaces.map(workspace => (
                <div key={workspace.id} className={styles.tnkWorkspace}>
                  <div className={styles.tnkWorkspace__header}>
                    <Badge
                      className={`${styles.tnkStatusIndicator} ${styles[`tnkStatusIndicator--${workspace.status}`]}`}
                      size="xs"
                      variant="dot"
                    />
                    <Text className={styles.tnkWorkspace__name}>{workspace.name}</Text>
                    <Text className={styles.tnkWorkspace__meta} size="xs" c="dimmed">
                      {workspace.tabCount} tabs
                    </Text>
                  </div>
                  <div className={styles.tnkWorkspace__footer}>
                    <Group className={styles.tnkWorkspace__status}>
                      {workspace.isOpen ? <FolderOpen size={14} /> : <Folder size={14} />}
                      <Text size="xs" c="dimmed">{workspace.lastChange}</Text>
                    </Group>
                    <Group className={styles.tnkWorkspace__actions}>
                      <Button size="xs" variant="light" className={styles.tnkWorkspace__actionBtn}>
                        {workspace.isOpen ? 'Switch to' : 'Open'}
                      </Button>
                      {workspace.isOpen && (
                        <Button size="xs" variant="light" className={styles.tnkWorkspace__actionBtn}>
                          Close
                        </Button>
                      )}
                    </Group>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current window section */}
          <div className={styles.tnkPopupContainer__section}>
            <Text className={styles.tnkPopupContainer__sectionTitle} size="sm" fw={500}>
              Current Window
            </Text>
            <Button
              leftSection={<PlayCircle size={16} />}
              className={styles.tnkBtn}
              fullWidth
            >
              Track as Workspace
            </Button>
          </div>

          {/* Global actions */}
          <div className={styles.tnkPopupContainer__section}>
            <Button
              variant="light"
              leftSection={<PlusCircle size={16} />}
              className={styles.tnkBtn}
              fullWidth
            >
              New Workspace
            </Button>
          </div>
        </AppShell.Main>
      </AppShell>
    </div>
  );
};
```

### 5. Manager Page

- AppShell with Navbar
- Tabs component for content sections
- DataTable for tab lists

## Phase 5: Progressive Enhancement

### State Management

- Use Mantine's form hooks for forms
- React Query for data fetching (future)
- Local state with useState/useReducer

### Styling Approach

```tsx
// Component usage with SCSS modules
import styles from './Page.module.scss';

<Button
  variant="filled"
  color="violet"
  size="sm"
  leftSection={<IconPlus />}
  className={styles.tnkButton}
>
  Track Window
</Button>

// Custom styling in SCSS module
```

```scss
// Page.module.scss
.tnkButton {
  // Custom overrides if needed
  font-weight: var(--tnk-font-weight-medium);

  &:hover {
    transform: translateY(-1px);
  }
}

.tnkCustomBox {
  background-color: var(--mantine-color-gray-0);
  padding: var(--mantine-spacing-md);
  border-radius: var(--mantine-radius-md);

  // BEM elements
  &__content {
    margin-top: var(--mantine-spacing-sm);
  }
}
```

### Icon Migration

- **Use Phosphor Icons**: Maintain consistency with existing design system
- Import pattern: `import { IconName } from '@phosphor-icons/react';`
- **Icon mapping from design system**:
  - `[gear]` → `<Gear />`
  - `[folder-open]` → `<FolderOpen />`
  - `[folder]` → `<Folder />`
  - `[play-circle]` → `<PlayCircle />`
  - `[plus-circle]` → `<PlusCircle />`
  - `[magnifying-glass]` → `<MagnifyingGlass />`
  - `[x]` → `<X />`
  - `[file-text]` → `<FileText />`
  - `[globe]` → `<Globe />`
- **Icon weights**: Use regular weight by default, bold for primary actions

## Benefits of This Approach

- **No runtime styling overhead** - SCSS modules compile to static CSS
- **Type-safe CSS** - CSS modules provide class name autocompletion
- **BEM structure preserved** - Familiar naming conventions for team
- **Better performance** - No CSS-in-JS runtime calculations
- **Better accessibility** - Mantine handles ARIA attributes
- **Responsive by default** - Mantine's breakpoint system
- **Rich component library** - Modals, notifications, tooltips included
- **Full TypeScript support** - Type-safe components and props
- **Theme consistency** - Mantine CSS variables + our SCSS variables

## Migration Path

1. Start with Welcome page as proof of concept
2. Build shared components as needed
3. Migrate pages one by one
4. Run both versions in parallel
5. Switch over when ready
6. Remove old implementation

## Acceptable Changes

- Button styles may look slightly different but preserve visual hierarchy
- Spacing might be adjusted to Mantine's scale while maintaining design token relationships
- Form inputs get Mantine's floating labels (improvement over current design)
- Status indicators use Mantine's Badge components with existing color coding
- Sidebar becomes responsive drawer on mobile (enhancement)
- **Design system preservation**: All existing BEM classes and component structure maintained
- **Icon consistency**: Continue using Phosphor Icons as specified in design system

## Success Criteria

- Functionality preserved
- Better code maintainability
- Improved accessibility
- Responsive design
- Modern React patterns
- Reduced CSS complexity
