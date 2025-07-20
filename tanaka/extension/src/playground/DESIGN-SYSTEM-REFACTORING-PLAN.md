# Tanaka UI Design System Refactoring Plan

## Overview

This plan details the complete refactoring of the Tanaka UI playground to eliminate redundancy and establish a
unified design system. The goal is to leverage the existing comprehensive design-system.css while removing
duplicate styles and establishing clear component patterns.

## Current State Analysis

### Strengths

- Well-structured CSS variables for colors, spacing, typography, and transitions
- Comprehensive component definitions in design-system.css
- Consistent use of CSS custom properties
- Good responsive foundations

### Issues to Address

1. Each HTML page has inline styles that duplicate design system components
2. Inconsistent component naming across pages
3. Mixed utility class patterns (legacy `u-` prefix vs modern)
4. No clear documentation on which components to use when
5. Redundant implementations of similar UI patterns

## Phase 1: Audit and Documentation

### 1.1 Complete Style Audit

- Create spreadsheet documenting every custom style in each HTML file
- Map custom styles to their design-system.css equivalents
- Identify styles that have no equivalent (candidates for design system additions)
- Document JavaScript dependencies on specific class names

### 1.2 Component Inventory

- List all UI components used across all pages
- Document variations of each component
- Identify which are already in design-system.css
- Mark components that need to be added or consolidated

### 1.3 Pattern Analysis

- Document recurring UI patterns (headers, sidebars, forms, etc.)
- Identify inconsistencies in similar patterns
- Create matrix of pattern usage across pages

## Phase 2: Design System Enhancement

### 2.1 Establish Component Hierarchy

#### Base Components (Atomic)

- Buttons: `.btn`, `.btn--primary`, `.btn--secondary`, `.btn--ghost`, `.btn--danger`, `.btn--icon`
- Form elements: `.field`, `.field__label`, `.field__input`, `.field__hint`, `.field__error`
- Cards: `.card`, `.card__header`, `.card__body`, `.card__footer`
- Status indicators: `.status`, `.status__dot`, `.status__text`, with variant modifiers

#### Composite Components (Molecular)

- Page layouts: `.page`, `.page__header`, `.page__sidebar`, `.page__content`
- Workspace components: `.workspace`, `.workspace__header`, `.workspace__meta`, `.workspace__actions`
- Navigation: `.nav`, `.nav__section`, `.nav__item`, `.nav__item--active`

#### Page Templates (Organisms)

- Popup layout structure
- Settings page structure
- Manager page structure
- Onboarding flow structure

### 2.2 Naming Convention Standardization

Adopt BEM methodology consistently:

- Block: `.component-name`
- Element: `.component-name__element`
- Modifier: `.component-name--modifier`

Remove legacy patterns and standardize on modern approach.

### 2.3 Utility Class Consolidation

Standardize utility classes:

- Spacing: `.m-{size}`, `.p-{size}` (remove `u-` prefix)
- Layout: `.flex`, `.flex-col`, `.flex-center`, `.gap-{size}`
- Typography: `.text-{size}`, `.font-{weight}`
- Display: `.hidden`, `.block`, `.inline-block`

## Phase 3: Page-by-Page Migration

### 3.1 Popup Page Migration

#### Current Custom Styles to Remove

- `.popup-container` → Use `.extension-frame--popup`
- `.popup-header` → Use `.card__header` or create `.popup__header`
- `.popup-body` → Use `.card__body`
- `.popup-section` → Use `.content-section`
- Custom button styles → Use `.btn` variants
- Custom search input → Use `.search-container` and `.search-input` from design system

#### JavaScript Updates

- Update all querySelector calls to use new class names
- Ensure event listeners still work with new structure
- Update any dynamic class additions/removals

#### HTML Structure Updates

```html
<!-- Old -->
<div class="popup-container">
  <div class="popup-header">...</div>
  <div class="popup-body">...</div>
</div>

<!-- New -->
<div class="extension-frame extension-frame--popup">
  <div class="card__header">...</div>
  <div class="card__body">...</div>
</div>
```

### 3.2 Settings Page Migration

#### Current Custom Styles to Remove

- `.settings-container` → Use `.page-container`
- `.settings-header` → Use `.page-header`
- `.settings-main` → Use `.page__content`
- Custom form styles → Use `.form-group`, `.form-label`, `.form-input`
- Custom button styles → Use design system buttons

#### Form Element Standardization

- Replace all custom input styles with `.form-input`
- Use `.form-group` for consistent spacing
- Apply `.form-hint` for helper text
- Use `.form-error` for validation messages

### 3.3 Manager Page Migration

#### Current Custom Styles to Remove

- `.manager-container` → Use `.two-column-layout`
- `.manager-content` → Use `.layout-main`
- Custom sidebar styles → Use `.layout-sidebar` and `.sidebar-*` classes
- `.workspace-header` → Already exists, ensure consistent usage
- Tab list styles → Consolidate with `.tab-item` component

#### Complex Components

- Timeline view: Create reusable `.timeline` component
- Trash view: Use `.card` components with appropriate modifiers
- Tab lists: Standardize on `.tab-item` component structure

### 3.4 Onboarding Page Migration

#### Current Custom Styles to Remove

- Custom card styles → Use `.card` component
- Progress indicators → Use `.progress-bar` and `.progress-fill`
- Feature lists → Use `.list` and `.list-item`
- Custom buttons → Use design system buttons

#### Special Considerations

- Maintain onboarding-specific animations
- Ensure step navigation still works
- Keep accessibility features intact

## Phase 4: Component Documentation

### 4.1 Component Usage Guide

Create comprehensive documentation for each component:

#### Button Component

```html
<!-- Primary action -->
<button class="btn btn--primary">
  <span class="icon icon--check"></span>
  Save Changes
</button>

<!-- Secondary action -->
<button class="btn btn--secondary">Cancel</button>

<!-- Ghost button for tertiary actions -->
<button class="btn btn--ghost">Learn More</button>

<!-- Icon-only button -->
<button class="btn btn--icon">
  <span class="icon icon--gear"></span>
</button>
```

#### Form Component

```html
<div class="field">
  <label class="field__label">Server URL</label>
  <input type="text" class="field__input" placeholder="https://...">
  <span class="field__hint">Enter your Tanaka server address</span>
</div>
```

### 4.2 Pattern Library

Document common UI patterns:

#### Empty State Pattern

```html
<div class="empty-state">
  <div class="empty-state__icon">📂</div>
  <h3 class="empty-state__title">No workspaces yet</h3>
  <p class="empty-state__text">Create your first workspace to get started</p>
  <button class="btn btn--primary">Create Workspace</button>
</div>
```

#### Status Row Pattern

```html
<div class="status-row status-row--success">
  <span class="status__dot"></span>
  <span class="status__text">Connected to server</span>
</div>
```

## Phase 5: Testing and Validation

### 5.1 Visual Regression Testing

- Screenshot each page before migration
- Screenshot after each component replacement
- Create visual diff report
- Document any intentional changes

### 5.2 Functionality Testing

- Test all interactive elements
- Verify JavaScript functionality
- Check responsive behavior
- Test keyboard navigation
- Verify screen reader compatibility

### 5.3 Cross-Page Consistency

- Ensure components look identical across pages
- Verify spacing consistency
- Check color usage
- Validate typography hierarchy

## Phase 6: Cleanup and Optimization

### 6.1 Remove Redundant Styles

- Delete all page-specific styles that duplicate design system
- Remove unused CSS classes
- Eliminate !important declarations
- Clean up specificity issues

### 6.2 Optimize Design System

- Group related components
- Add source comments for component sections
- Consider splitting into multiple files:
  - `design-system-core.css` (variables, reset)
  - `design-system-components.css` (components)
  - `design-system-utilities.css` (utility classes)

### 6.3 Performance Optimization

- Measure CSS file size before/after
- Consider critical CSS extraction
- Implement CSS purging for production
- Add CSS minification to build process

## Phase 7: Documentation and Training

### 7.1 Create Style Guide

- Visual component showcase
- Interactive examples
- Code snippets for each component
- Do's and don'ts for each pattern

### 7.2 Migration Guide

- Document what changed
- Provide migration examples
- List breaking changes
- Include troubleshooting section

### 7.3 Best Practices Document

- When to create new components vs using existing
- How to extend components properly
- Naming convention guide
- Performance considerations

## Implementation Checklist

### Popup Page

- [ ] Audit all custom styles
- [ ] Map to design system equivalents
- [ ] Update HTML structure
- [ ] Update JavaScript selectors
- [ ] Test all functionality
- [ ] Visual regression test
- [ ] Remove redundant CSS
- [ ] Update popup.ts imports/types

### Settings Page

- [ ] Audit form elements
- [ ] Standardize form components
- [ ] Update connection status UI
- [ ] Migrate custom buttons
- [ ] Test form validation
- [ ] Update settings.ts
- [ ] Remove inline styles

### Manager Page

- [ ] Migrate sidebar structure
- [ ] Standardize workspace components
- [ ] Update tab list components
- [ ] Migrate timeline view
- [ ] Standardize trash view
- [ ] Update all JavaScript
- [ ] Test navigation
- [ ] Remove custom layouts

### Onboarding Page

- [ ] Audit card components
- [ ] Standardize progress indicators
- [ ] Update feature lists
- [ ] Maintain animations
- [ ] Test step navigation
- [ ] Update onboarding.ts
- [ ] Ensure accessibility

### Design System Updates

- [ ] Add missing components
- [ ] Document all components
- [ ] Create usage examples
- [ ] Establish patterns
- [ ] Remove legacy code
- [ ] Optimize file structure
- [ ] Add build optimization

## Success Criteria

1. **Zero Visual Regressions**: All pages should look identical or better after migration
2. **Code Reduction**: At least 50% reduction in custom CSS across pages
3. **Consistency**: Every instance of a component uses the same classes
4. **Documentation**: Every component has clear usage documentation
5. **Performance**: CSS file size reduced or split efficiently
6. **Maintainability**: Clear patterns for adding new features
7. **Developer Experience**: Faster development with reusable components

## Risk Mitigation

1. **JavaScript Breakage**: Maintain compatibility layer during migration
2. **Visual Regressions**: Implement automated screenshot testing
3. **Performance Impact**: Monitor CSS file size throughout
4. **Developer Confusion**: Provide clear migration documentation
5. **Incomplete Migration**: Use feature flags to enable gradual rollout

## Future Enhancements

1. **CSS-in-JS Migration**: Consider modern styling solutions
2. **Component Library**: Build interactive component showcase
3. **Design Tokens**: Implement design token build process
4. **Theming**: Add dark mode support
5. **Accessibility**: Enhanced ARIA patterns
6. **Animation Library**: Standardized animation classes
7. **Icon System**: Proper icon font or SVG system

This plan provides a comprehensive roadmap for refactoring the Tanaka UI design system while maintaining
functionality and improving developer experience.
