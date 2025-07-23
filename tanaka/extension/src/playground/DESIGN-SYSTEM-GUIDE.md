# Tanaka UI Design System Guide

This guide documents the standardized components and patterns in the Tanaka playground design system.

## Core Principles

1. **BEM Naming Convention**: All classes follow Block Element Modifier pattern
2. **Prefix**: All classes use `tnk-` prefix to avoid conflicts
3. **CSS Variables**: Design tokens defined in `:root` for consistency
4. **Component-Based**: Reusable components over page-specific styles

## Component Reference

### Layout Components

#### Page Container

```html
<div class="tnk-playground-container">
  <div class="tnk-playground-container__header">
    <h1 class="tnk-playground-container__title">Page Title</h1>
  </div>
  <div class="tnk-playground-container__layout">
    <!-- Page content -->
  </div>
</div>
```

#### Page Frame

```html
<!-- Base page frame -->
<div class="tnk-playground-page-frame">
  <!-- Page content -->
</div>

<!-- Popup variant -->
<div class="tnk-playground-page-frame tnk-playground-page-frame--popup">
  <!-- Popup-specific layout -->
</div>

<!-- Welcome variant -->
<div class="tnk-playground-page-frame tnk-playground-page-frame--welcome">
  <!-- Welcome page layout -->
</div>
```

#### Card

```html
<div class="tnk-card">
  <div class="tnk-card__header">Header Content</div>
  <div class="tnk-card__body">Body Content</div>
  <div class="tnk-card__footer">Footer Content</div>
</div>
```

#### Page Header

```html
<div class="tnk-page-header">
  <h1 class="tnk-page-header__title">Page Title</h1>
  <button class="tnk-btn tnk-btn--icon">
    <i class="tnk-icon ph ph-gear"></i>
  </button>
</div>
<div class="tnk-page-header__meta">Metadata text</div>
```

### Form Components

#### Form Group

```html
<div class="tnk-form-group">
  <label class="tnk-form-group__label">Field Label</label>
  <input type="text" class="tnk-form-group__input" />
  <div class="tnk-form-group__hint">Helper text</div>
  <div class="tnk-form-group__error">Error message</div>
</div>
```

#### Select

```html
<select class="tnk-form-group__select">
  <option>Option 1</option>
  <option>Option 2</option>
</select>

<!-- Inline select variant -->
<select class="tnk-form-group__select tnk-form-group__select--inline">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

### Button Components

#### Button Variants

```html
<!-- Primary action -->
<button class="tnk-btn tnk-btn--primary">Save Changes</button>

<!-- Secondary action -->
<button class="tnk-btn tnk-btn--secondary">Cancel</button>

<!-- Ghost button -->
<button class="tnk-btn tnk-btn--ghost">Learn More</button>

<!-- Danger button -->
<button class="tnk-btn tnk-btn--danger">Delete</button>

<!-- Icon button -->
<button class="tnk-btn tnk-btn--icon">
  <i class="tnk-icon ph ph-gear"></i>
</button>

<!-- Small button -->
<button class="tnk-btn tnk-btn--small">Action</button>

<!-- Full width button -->
<button class="tnk-btn tnk-btn--primary tnk-btn--full-width">Continue</button>
```

### List Components

#### Basic List

```html
<ul class="tnk-list">
  <li class="tnk-list__item">
    <i class="tnk-icon tnk-list__icon ph ph-file"></i>
    <div class="tnk-list__content">
      <h3 class="tnk-list__title">Item Title</h3>
      <p class="tnk-list__subtitle">Subtitle text</p>
    </div>
    <div class="tnk-list__actions">
      <button class="tnk-btn tnk-btn--small">Action</button>
    </div>
  </li>
</ul>
```

### Navigation Components

#### Sidebar

```html
<div class="tnk-sidebar">
  <div class="tnk-sidebar__section">
    <div class="tnk-sidebar__title">Section Title</div>
    <button class="tnk-sidebar__item tnk-sidebar__item--active">
      Active Item
    </button>
    <button class="tnk-sidebar__item">Normal Item</button>
    <button class="tnk-sidebar__item tnk-sidebar__item--indented">
      Indented Item
    </button>
  </div>
</div>

<!-- With page-specific modifiers -->
<div class="tnk-sidebar tnk-sidebar--manager">
  <!-- Manager-specific sidebar styling -->
</div>
```

### Status Components

#### Status Indicator

```html
<span class="tnk-status-indicator tnk-status-indicator--synced"></span>
<span class="tnk-status-indicator tnk-status-indicator--syncing"></span>
<span class="tnk-status-indicator tnk-status-indicator--error"></span>
```

#### Status Row

```html
<div class="tnk-status">
  <span class="tnk-status__dot tnk-status__dot--synced"></span>
  <span class="tnk-status__text">Connected</span>
</div>
```

### Content Components

#### Section

```html
<div class="tnk-section">
  <h2 class="tnk-section__header">Section Title</h2>
  <!-- Section content -->
</div>
```

#### Empty State

```html
<div class="tnk-empty-state">
  <div class="tnk-empty-state__icon">
    <i class="tnk-icon tnk-icon--xxxl ph ph-folder"></i>
  </div>
  <h3 class="tnk-empty-state__title">No Items</h3>
  <p class="tnk-empty-state__description">Create your first item to get started</p>
</div>
```

### Utility Classes

#### Icons

```html
<i class="tnk-icon ph ph-gear"></i>
<i class="tnk-icon tnk-icon--xs ph ph-x"></i>
<i class="tnk-icon tnk-icon--sm ph ph-info"></i>
<i class="tnk-icon tnk-icon--md ph ph-warning"></i>
<i class="tnk-icon tnk-icon--lg ph ph-star"></i>
<i class="tnk-icon tnk-icon--xl ph ph-folder"></i>
<i class="tnk-icon tnk-icon--xxl ph ph-check"></i>
<i class="tnk-icon tnk-icon--xxxl ph ph-trophy"></i>
<i class="tnk-icon tnk-icon--spinning ph ph-arrow-clockwise"></i>
```

#### Text

```html
<span class="tnk-text">Base text</span>
<span class="tnk-text tnk-text--sm">Small text</span>
<span class="tnk-text tnk-text--lg">Large text</span>
```

## Design Tokens

### Colors

- Primary: `var(--tnk-primary)`
- Secondary: `var(--tnk-secondary)`
- Success: `var(--tnk-success)`
- Warning: `var(--tnk-warning)`
- Error: `var(--tnk-error)`

### Spacing

- `var(--tnk-space-xs)` through `var(--tnk-space-10xl)`

### Typography

- Font sizes: `var(--tnk-text-xs)` through `var(--tnk-text-4xl)`
- Font weights: `var(--tnk-font-weight-normal)` through `var(--tnk-font-weight-bold)`

### Shadows

- `var(--tnk-shadow-sm)` through `var(--tnk-shadow-xl)`

### Border Radius

- `var(--tnk-radius-sm)` through `var(--tnk-radius-full)`

## Animations

The design system includes standard animations for consistent motion:

### Available Animations

```css
/* Slide in from left */
.element {
  animation: tnk-slideIn 0.3s ease-out;
}

/* Fade in */
.element {
  animation: tnk-fadeIn 0.4s ease-out;
}

/* Bounce effect */
.element {
  animation: tnk-bounce 0.6s ease;
}

/* Spin (for loading indicators) */
.tnk-icon--spinning {
  animation: spin 1s linear infinite;
}
```

## Migration Guide

When migrating existing pages to use the design system:

1. Replace custom styles with design system components
2. Update class names to follow BEM convention with `tnk-` prefix
3. Use CSS variables instead of hardcoded values
4. Remove redundant CSS from page-specific stylesheets
5. Test all functionality after migration

## Best Practices

1. **Component First**: Always check if a design system component exists before creating custom styles
2. **Consistent Spacing**: Use spacing variables instead of arbitrary values
3. **Semantic HTML**: Use appropriate HTML elements with design system classes
4. **Accessibility**: Ensure all interactive elements have proper ARIA attributes
5. **Performance**: Reuse existing components to reduce CSS bundle size
