# Architecture Documentation Update Tasks

## Guidelines for Documentation Updates

### DOs

- **ALWAYS** make destructive changes - replace old content directly
- **ALWAYS** edit existing documentation files in-place
- **ALWAYS** remove outdated information completely
- **ALWAYS** update to reflect current architecture without migration notes

### DON'Ts

- **NEVER** create new documentation files - always edit existing ones
- **NEVER** mention migration paths or backward compatibility
- **NEVER** add feature flags or gradual rollout notes
- **NEVER** preserve old patterns alongside new ones

## Critical Documentation Updates

### Files to Archive/Remove

- [x] Remove references to archive/REACT-MIGRATION-PLAN.md in other docs
- [x] Remove references to archive/DESIGN-SYSTEM-GUIDE.md in other docs
- [x] Move INTERACTIVE_EXAMPLES.md to archive - Future work, not current priority

### Files to Rename

- [x] Update ARCHITECTURE.md for full extension architecture

### Immediate Content Updates

- [x] PLAYGROUND_MIGRATION_PLAN.md - Remove React migration phases (already complete)
- [x] PLAYGROUND_MIGRATION_PLAN.md - Update to focus only on remaining phases
- [ ] ARCHITECTURE.md - Fix CRDT implementation details (mentions Yjs but uses different). Confirm with user first before
making changes
- [x] ARCHITECTURE.md - Update description of custom JSON-based CRDT (not Yjs)
- [x] Remove all references to extensive CSS design system (keeping minimal BEM classes)
- [x] Remove all references to vanilla HTML/CSS/TypeScript playground experiment
- [x] Update all playground references to React + Mantine (no migration notes needed)

### Documentation Consolidation

- [ ] Merge any playground-specific content from UI-DESIGN.md into ARCHITECTURE.md
- [ ] Ensure all navigation sections reference correct file names after reorganization

### Critical Missing Documentation

- [ ] Full extension architecture overview (popup, background, settings, manager)
- [ ] Current state of playground (React with Mantine)
- [ ] ServicesProvider/DI system documentation
- [ ] Multi-entry point build structure

## Meta Task

- [x] Read through all docs in tanaka/docs/ one at a time
- [x] Update this ARCHITECTURE_UPDATE_TASKS.md with additional tasks discovered
- [x] Note any inconsistencies between docs
- [x] Identify outdated information that needs updating
- [x] Find gaps in documentation coverage

## ARCHITECTURE.md Updates

### Rename and Reframe

- [x] Update title from "Playground Architecture" to "Extension Architecture"
- [x] Rewrite overview to describe entire extension architecture
- [x] Position playground as the development/testing environment within the larger system

### Complete Directory Structure

- [x] Add background script location and structure
- [x] Add popup directory structure
- [x] Add content scripts directory (if applicable)
- [x] Add settings page structure
- [x] Add manager page structure
- [x] Show shared services across all parts

### Extension-wide Systems Documentation

- [x] Document how DI system serves entire extension
- [x] Show service provider usage across popup, settings, background, etc.
- [x] Document message passing architecture between components
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

### Documentation to Add to Existing Files

- [ ] Add extension patterns section to ARCHITECTURE.md
- [ ] Add message contracts section to ARCHITECTURE.md
- [ ] Add shared components section to ARCHITECTURE.md
- [ ] Add testing strategy section to DEVELOPMENT.md

### Updates to Existing Docs

- [ ] Update main README.md to reference new architecture doc
- [ ] Update DEVELOPMENT.md with new structure
- [ ] Update CLAUDE.md with new patterns and file locations

## Discovered Issues and Inconsistencies

### Documentation Organization

- [ ] DESIGN-SYSTEM-GUIDE.md references old CSS system that's being removed
- [ ] REACT-MIGRATION-PLAN.md conflicts with new architecture plan (CSS variables vs Mantine defaults)

### Outdated Information

- [ ] DESIGN-SYSTEM-GUIDE.md needs complete rewrite after CSS simplification
- [ ] REACT-MIGRATION-PLAN.md references _tanaka_vars.scss and _mantine_vars.scss that will be removed
- [ ] UI-DESIGN.md doesn't mention playground at all - needs extension architecture context

### Missing Documentation

- [ ] No documentation for new ServicesProvider/DI system
- [ ] No documentation for playground's role in extension development

### Architecture Conflicts

- [ ] ARCHITECTURE.md focuses on Yjs CRDT but code uses different implementation
- [ ] Multiple references to extensive CSS design system (should mention minimal BEM classes)
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
