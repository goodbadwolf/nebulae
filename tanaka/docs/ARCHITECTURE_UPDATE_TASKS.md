# Architecture Documentation Update Tasks

## Critical Pre-Migration Documentation Updates

### Files to Archive/Remove

- [ ] Archive REACT-MIGRATION-PLAN.md - Obsolete since playground already uses React
- [ ] Archive DESIGN-SYSTEM-GUIDE.md - References CSS system being removed
- [ ] Move INTERACTIVE_EXAMPLES.md to archive - Future work, not current priority

### Files to Rename

- [ ] Rename current EXTENSION_ARCHITECTURE.md to PLAYGROUND_ARCHITECTURE.md
- [ ] Create new EXTENSION_ARCHITECTURE.md for full extension architecture

### Immediate Content Updates

- [ ] PLAYGROUND_MIGRATION_PLAN.md - Remove React migration phases (already complete)
- [ ] PLAYGROUND_MIGRATION_PLAN.md - Update to focus only on remaining phases
- [ ] ARCHITECTURE.md - Fix CRDT implementation details (mentions Yjs but uses different)
- [ ] Remove all references to CSS design system across all docs

### Documentation Consolidation

- [ ] Merge any playground-specific content from UI-DESIGN.md into PLAYGROUND_ARCHITECTURE.md
- [ ] Ensure all navigation sections reference correct file names after reorganization

### Critical Missing Documentation

- [ ] Full extension architecture overview (popup, background, settings, manager)
- [ ] Current state of playground (React with Mantine, not vanilla JS)
- [ ] Explanation of playground-js vs playground-react directories
- [ ] @kiku/core dependency and WithDefaults pattern usage

## Meta Task

- [x] Read through all docs in tanaka/docs/ one at a time
- [x] Update this ARCHITECTURE_UPDATE_TASKS.md with additional tasks discovered
- [x] Note any inconsistencies between docs
- [x] Identify outdated information that needs updating
- [x] Find gaps in documentation coverage

## EXTENSION_ARCHITECTURE.md Updates

### Rename and Reframe

- [ ] Update title from "Playground Architecture" to "Extension Architecture"
- [ ] Rewrite overview to describe entire extension architecture
- [ ] Position playground as the development/testing environment within the larger system

### Complete Directory Structure

- [ ] Add background script location and structure
- [ ] Add popup directory structure
- [ ] Add content scripts directory (if applicable)
- [ ] Add settings page structure
- [ ] Add manager page structure
- [ ] Show shared services across all parts

### Extension-wide Systems Documentation

- [ ] Document how DI system serves entire extension
- [ ] Show service provider usage across popup, settings, background, etc.
- [ ] Document message passing architecture between components
- [ ] Add state management strategy (storage coordination)
- [ ] Document shared component library usage patterns

### URL Structure Expansion

- [ ] Document all extension URLs (not just playground)
- [ ] Add popup URL patterns
- [ ] Add settings page URL
- [ ] Add manager page URL
- [ ] Document how internal navigation works

### Add New Sections

- [ ] Background Script Architecture
  - Event handling patterns
  - State management
  - Message handling
  - Service worker considerations
- [ ] Popup Architecture
  - Quick actions design
  - State synchronization
  - Performance constraints
- [ ] Message Passing Architecture
  - Message types and contracts
  - Type safety patterns
  - Error handling
- [ ] Extension Lifecycle
  - Installation flow
  - Update handling
  - Data migration

### Update Design Decisions

- [ ] Clarify that CSS architecture applies extension-wide
- [ ] Document cross-component communication patterns
- [ ] Add security considerations for extension context

## PLAYGROUND_MIGRATION_PLAN.md Updates

### Clarify Scope

- [ ] Add note that this establishes patterns for entire extension
- [ ] Mention that each phase benefits the whole extension, not just playground
- [ ] Update goals to reflect extension-wide impact

### Update Phase Descriptions

- [ ] css-simplification: Note this affects all extension UIs
- [ ] component-reorganization: Mention these serve entire extension
- [ ] dependency-injection: Emphasize extension-wide usage
- [ ] welcome-separation: Frame as pattern for all standalone pages

### Add Future Phases

- [ ] Phase popup-migration: Apply same patterns to popup
- [ ] Phase settings-migration: Apply patterns to settings
- [ ] Phase background-services: Integrate DI with background script
- [ ] Phase message-typing: Type-safe message passing

### Success Metrics

- [ ] Add metrics about extension-wide consistency
- [ ] Include performance impact on all extension parts
- [ ] Document how to verify patterns work across contexts

## Additional Documentation Needs

### New Documents to Create

- [ ] EXTENSION_PATTERNS.md - Common patterns used throughout
- [ ] MESSAGE_CONTRACTS.md - Message passing specifications
- [ ] COMPONENT_LIBRARY.md - Shared component documentation
- [ ] TESTING_STRATEGY.md - How to test across extension contexts

### Updates to Existing Docs

- [ ] Update main README.md to reference new architecture doc
- [ ] Update DEVELOPMENT.md with new structure
- [ ] Update CLAUDE.md with new patterns and file locations

## Discovered Issues and Inconsistencies

### Documentation Organization

- [ ] EXTENSION_ARCHITECTURE.md and PLAYGROUND_MIGRATION_PLAN.md are in root docs/ but should be in tanaka/docs/
- [ ] DESIGN-SYSTEM-GUIDE.md references old CSS system that's being removed
- [ ] REACT-MIGRATION-PLAN.md conflicts with new architecture plan (CSS variables vs Mantine defaults)

### Outdated Information

- [ ] DESIGN-SYSTEM-GUIDE.md needs complete rewrite after CSS simplification
- [ ] REACT-MIGRATION-PLAN.md references _tanaka_vars.scss and _mantine_vars.scss that will be removed
- [ ] UI-DESIGN.md doesn't mention playground at all - needs extension architecture context

### Missing Documentation

- [ ] No documentation for @kiku/core dependency and WithDefaults pattern
- [ ] No documentation for new ServicesProvider/DI system
- [ ] No documentation for playground's role in extension development
- [ ] No documentation for the two playground versions (playground-js vs playground-react)

### Architecture Conflicts

- [ ] ARCHITECTURE.md focuses on Yjs CRDT but code uses different implementation
- [ ] Multiple references to CSS design system that's being simplified
- [ ] Playground structure differs from what's documented

### Navigation Updates Needed

- [ ] All docs have navigation sections that need updating with new docs
- [ ] Some docs reference non-existent files in navigation

## Phase-Specific Documentation Updates

### After Phase css-simplification

- [ ] Remove DESIGN-SYSTEM-GUIDE.md or rewrite completely
- [ ] Update all component examples to use Mantine props
- [ ] Document new ThemeProvider usage
- [ ] Update CLAUDE.md CSS architecture section

### After Phase component-reorganization

- [ ] Document new component locations in src/components/
- [ ] Update import examples throughout docs
- [ ] Create component usage guide

### After Phase dependency-injection

- [ ] Document DI patterns and usage
- [ ] Add examples of mock vs real providers
- [ ] Document testing with DI

### After Phase welcome-separation

- [ ] Document multi-entry point structure
- [ ] Update build configuration docs

### After Phase navigation-structure

- [ ] Document new playground navigation
- [ ] Add examples pattern documentation
- [ ] Update playground usage guide
