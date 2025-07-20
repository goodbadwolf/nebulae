# Tanaka UI Design System Audit

This audit documents all custom styles in each HTML page and maps them to their design-system.css equivalents.

## Summary Statistics

- **Total Custom CSS Rules**: ~150+ across all pages
- **Redundant Styles**: ~70% can be replaced with existing design system classes
- **Missing Components**: ~15 components need to be added to design system
- **JavaScript Dependencies**: 25+ selectors that need updating

## Popup Page (popup.html)

### Custom Styles Audit

| Custom Style | Purpose | Design System Equivalent | Action Required |
|--------------|---------|-------------------------|-----------------|
| `.simulator-controls` | Control panel container | `.card` with padding utilities | Replace |
| `.controls-row` | Flex row for controls | `.flex` + `.gap-2xl` + `.flex-wrap` | Replace |
| `.search-input-control` | Search input styling | `.form-input` (almost identical) | Replace |
| `.popup-simulator` | Main layout container | `.flex` + `.gap-3xl` + `.justify-center` | Replace |
| `.popup-viewport` | Popup preview container | `.extension-frame` + `.extension-frame--popup` | Replace |
| `.info-panel` | Information sidebar | `.card` or `.info-panel` (already exists) | Use existing |
| `.popup-container` | Popup content wrapper | `.extension-frame--popup` body | Replace |
| `.popup-header` | Popup header section | `.card__header` or create `.popup__header` | Replace/Add |
| `.popup-body` | Popup main content | `.card__body` | Replace |
| `.popup-section` | Content sections | `.content-section` | Replace |
| `.workspace-item` | Workspace list item | Component already exists | Use existing |
| `.workspace-header` | Item header | Component already exists | Use existing |
| `.workspace-name` | Workspace title | `.workspace-item__title` | Replace |
| `.workspace-footer` | Item footer | `.workspace-item__meta` | Replace |
| `.workspace-status` | Status display | `.state-indicator` | Replace |
| `.workspace-actions` | Action buttons | `.workspace-item__actions` | Replace |
| `.workspace-list` | Container for items | `.list` or flex container | Replace |
| `.meta-text` | Metadata text | `.text-muted` + `.text-sm` | Replace |
| `.search-container` | Search wrapper | Component exists in design system | Use existing |
| `.search-icon` | Search icon positioning | Part of `.search-container` | Use existing |
| `.clear-button` | Clear search button | `.button--icon` | Replace |
| `.empty-state` | Empty state display | Component exists | Use existing |
| `.section-title` | Section headers | Component exists | Use existing |

### JavaScript Selectors to Update

```javascript
// Current selectors that need updating:
document.getElementById('popupContainer')
document.querySelectorAll('[data-state]')
document.querySelectorAll('[data-workspaces]')
document.querySelectorAll('.state-button')
document.querySelectorAll('.workspace-item')
document.querySelector('.search-input')
```

## Settings Page (settings.html)

### Custom Styles Audit

| Custom Style | Purpose | Design System Equivalent | Action Required |
|--------------|---------|-------------------------|-----------------|
| `.settings-viewport` | Settings container | `.viewport` | Use existing |
| `.settings-container` | Main layout | `.two-column-layout` | Replace |
| `.settings-header` | Page header | `.viewport-header` | Use existing |
| `.settings-content` | Content wrapper | `.layout-main` | Replace |
| `.settings-main` | Main content area | `.page__content` | Replace |
| `.section-title` | Section headers | Component exists | Use existing |
| `.button-row` | Button container | `.button-group` | Use existing |
| `.test-button` | Test connection button | `.button--secondary` | Replace |
| `.save-button` | Save button | `.button--primary` | Replace |
| Form input styles | Custom form styling | `.form-group`, `.form-input`, `.form-label` | Replace |

### Missing Components Needed

1. **Connection Status Component**
   - Shows server connection state with icon
   - Includes last sync time
   - Color-coded status indicator

2. **Settings Form Layout**
   - Consistent spacing for form sections
   - Label/input alignment
   - Help text positioning

## Manager Page (manager.html)

### Custom Styles Audit

| Custom Style | Purpose | Design System Equivalent | Action Required |
|--------------|---------|-------------------------|-----------------|
| `.manager-viewport` | Manager container | `.viewport` | Use existing |
| `.manager-container` | Layout wrapper | `.two-column-layout` | Replace |
| `.manager-header` | Page header | `.viewport-header` | Use existing |
| `.manager-content` | Content area | `.layout-main` | Replace |
| `.manager-main` | Main content | `.page__content` | Replace |
| `.sidebar-section` | Sidebar sections | Component exists | Use existing |
| `.sidebar-title` | Section titles | Component exists | Use existing |
| `.sidebar-item` | Navigation items | Component exists | Use existing |
| `.workspace-header` | Workspace header | Component exists | Use existing |
| `.workspace-title` | Title styling | `.page-title` or `.workspace__title` | Replace |
| `.edit-button` | Edit icon button | `.button--icon` | Replace |
| `.workspace-meta` | Metadata display | `.text-secondary` + `.text-sm` | Replace |
| `.content-section` | Content sections | Component exists | Use existing |
| `.section-header` | Section headers | Component exists | Use existing |
| `.tab-list` | Tab list container | `.list` | Replace |
| `.tab-item` | Tab list item | Component partially exists | Enhance |
| `.tab-icon` | Tab favicon | `.icon` | Replace |
| `.tab-info` | Tab details | `.tab-item__content` | Replace |
| `.tab-title` | Tab title | `.tab-item__title` | Replace |
| `.tab-url` | Tab URL display | `.tab-item__url` | Replace |
| `.recently-closed-item` | Closed tab item | Create new component | Add |
| `.restore-button` | Restore action | `.button--ghost` or `.button--secondary` | Replace |
| `.device-count` | Device counter | `.text-muted` + `.text-sm` | Replace |

### Complex Components Needed

1. **Timeline Component**

   ```css
   .timeline
   .timeline__item
   .timeline__time
   .timeline__content
   .timeline__action
   ```

2. **Trash Component**

   ```css
   .trash-item
   .trash-item__header
   .trash-item__meta
   .trash-item__actions
   ```

## Onboarding Page (onboarding.html)

### Custom Styles Audit

| Custom Style | Purpose | Design System Equivalent | Action Required |
|--------------|---------|-------------------------|-----------------|
| `.onboarding-container` | Main container | `.page-container` | Replace |
| `.onboarding-header` | Page header | `.page-header` | Replace |
| `.onboarding-content` | Content wrapper | `.page__content` | Replace |
| `.step-indicators` | Progress dots | `.progress-bar` variant | Create variant |
| `.step-dot` | Individual step | Custom component needed | Add |
| `.step-content` | Step container | `.card` | Replace |
| `.feature-card` | Feature display | `.card` component | Use existing |
| `.feature-icon` | Feature icon | `.card__icon` | Use existing |
| `.feature-title` | Feature heading | `.card__title` | Use existing |
| `.feature-description` | Feature text | `.card__description` | Use existing |
| `.button-group` | Action buttons | Component exists | Use existing |
| `.skip-button` | Skip action | `.button--ghost` | Replace |
| `.next-button` | Next action | `.button--primary` | Replace |

## Common Patterns Across Pages

### Redundant Implementations

1. **Status Indicators**
   - Each page has slightly different status dot implementations
   - Should use consistent `.status-dot` with modifiers

2. **Button Styles**
   - Multiple button variations doing the same thing
   - Consolidate to `.button` with consistent modifiers

3. **Form Elements**
   - Custom input styles on each page
   - Should use `.form-input` consistently

4. **Spacing Utilities**
   - Inline margin/padding styles everywhere
   - Should use spacing utilities (`.mt-lg`, `.p-md`, etc.)

5. **Typography**
   - Inconsistent font sizes and weights
   - Should use typography utilities (`.text-lg`, `.font-semibold`)

### JavaScript Class Dependencies

These classes are used in JavaScript and need careful migration:

```javascript
// Popup page
'.popup-container'
'.workspace-item'
'.search-input'
'.state-button'

// Settings page
'.test-button'
'.save-button'
'.connection-status'

// Manager page
'.sidebar-item'
'.tab-item'
'.restore-button'

// Onboarding page
'.step-dot'
'.next-button'
'.skip-button'
```

## Components to Add to Design System

### High Priority (Used Multiple Places)

1. **Page Layout Components**

   ```css
   .page
   .page__header
   .page__content
   .page__sidebar
   .page__footer
   ```

2. **Timeline Component**

   ```css
   .timeline
   .timeline__item
   .timeline__marker
   .timeline__content
   .timeline__meta
   ```

3. **Tab List Component Enhancement**

   ```css
   .tab-list
   .tab-list__item
   .tab-list__icon
   .tab-list__content
   .tab-list__title
   .tab-list__url
   .tab-list__actions
   ```

### Medium Priority (Page Specific)

1. **Onboarding Components**

   ```css
   .step-indicator
   .step-indicator__item
   .step-indicator__item--active
   .step-indicator__item--completed
   ```

2. **Trash/Archive Components**

   ```css
   .archive-item
   .archive-item__header
   .archive-item__meta
   .archive-item__actions
   ```

### Low Priority (Nice to Have)

1. **Enhanced Search Component**

   ```css
   .search
   .search__input
   .search__icon
   .search__clear
   .search__results
   ```

## Migration Priority

Based on usage frequency and impact:

1. **Popup page** - Most used, simplest structure
2. **Settings page** - Form-heavy, good test for form components  
3. **Manager page** - Complex layout, tests component system
4. **Onboarding page** - Least critical, can be done last

## Estimated Impact

- **CSS Reduction**: ~60-70% less custom CSS
- **Maintenance**: Much easier with consistent patterns
- **Development Speed**: 2-3x faster for new features
- **Consistency**: 100% component reuse across pages

## Next Steps

1. Create missing components in design-system.css
2. Update JavaScript to use new selectors
3. Migrate pages one by one
4. Test thoroughly after each migration
5. Document patterns for future use
