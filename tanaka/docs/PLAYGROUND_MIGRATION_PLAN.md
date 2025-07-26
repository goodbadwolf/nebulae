# Playground Migration Plan

## Overview

This document outlines the step-by-step plan to establish extension-wide patterns using the playground as the proving
ground. Each phase benefits the entire extension, not just the playground.

## Migration Philosophy

- **MVP First**: Implement minimal viable versions, then enhance
- **Working State**: Every commit leaves the system functional
- **Incremental**: Small, reviewable changes
- **Dependency Order**: Build foundations before features

## Key Principles

1. **Every commit must pass**: build, lint, and typecheck
2. **Document as you go**: Update docs at the end of each phase
3. **Test thoroughly**: Both manual and automated testing
4. **Keep it working**: No breaking changes without migration path

## Target Architecture

The playground serves as a development environment while establishing patterns for the entire extension.
See ARCHITECTURE.md for the complete extension architecture.

## Migration Approach: MVP First

Each phase will be implemented in minimal viable form first, then enhanced as needed. This allows for quick end-to-end
validation and learning.

## Migration Checklist (Reordered for Dependencies)

### Phase css-simplification

#### MVP Scope

- Remove custom CSS variable files
- Create basic ThemeProvider

#### Full Implementation

- [ ] Create ThemeProvider component in src/components/theme-provider.tsx
- [ ] Update globals.scss to minimal version with BEM classes (.tnk-*)
- [ ] Replace extensive CSS variables with Mantine props
- [ ] Update all components to use Mantine defaults
- [ ] Keep minimal BEM classes for custom styling needs
- [ ] Test that everything still looks good
- [ ] Update documentation:
  - [ ] Remove extensive CSS design system references
  - [ ] Update CLAUDE.md with new patterns
  - [ ] Update component usage examples

### Phase component-reorganization

#### MVP Scope

- Audit components and remove unnecessary ones
- Move only critical components (page-shell, icon)

#### Full Implementation

- [ ] Audit existing components for removal candidates
- [ ] Move generic components to src/components/
  - [ ] page-shell (MVP)
  - [ ] icon (MVP)
  - [ ] app-logo
  - [ ] responsive-grid
  - [ ] card
- [ ] Update all import paths
- [ ] Test build and functionality
- [ ] Update documentation:
  - [ ] Document new component locations
  - [ ] Update import examples in docs

### Phase dependency-injection

#### MVP Scope

- Core DI system
- One simple storage provider for playground

#### Full Implementation

- [ ] Create DI system in src/di/
  - [ ] IServiceProvider interface (MVP)
  - [ ] ServicesContainer class (MVP)
  - [ ] ServicesContext and provider (MVP)
  - [ ] withServicesContainer HOC (MVP)
- [ ] Create storage providers in src/storage/
  - [ ] IStorageProvider interface (MVP)
  - [ ] BrowserStorageProvider (MVP)
  - [ ] MockStorageProvider
- [ ] Create API providers in src/api/
  - [ ] IAPIProvider interface
  - [ ] ServerAPIProvider
  - [ ] MockAPIProvider
- [ ] Test DI system works with mock/real providers
- [ ] Update documentation:
  - [ ] Document DI patterns
  - [ ] Add testing examples
  - [ ] Update architecture docs

### Phase welcome-separation

#### MVP Scope

- Move files and create entry point
- Basic DI integration

#### Full Implementation

- [ ] Move welcome page to src/welcome/
- [ ] Create separate entry point for welcome
- [ ] Integrate with DI system using withServicesContainer
- [ ] Update rsbuild.config.ts with welcome entry
- [ ] Test welcome page works independently
- [ ] Update documentation:
  - [ ] Document welcome page as separate entry
  - [ ] Update navigation docs

### Phase navigation-structure

#### MVP Scope

- Simple list navigation (not collapsible)
- Basic layout without all features

#### Full Implementation

- [ ] Create Navigation component
  - [ ] Simple list navigation (MVP)
  - [ ] Collapsible sidebar using Mantine NavLink
- [ ] Implement playground layout with Mantine AppShell
- [ ] Create PagesSection component with card grid
- [ ] Create ComponentsSection component
  - [ ] Implement basic StaticExamplesContainer pattern
  - [ ] Set up examples scanner to load *.examples.tsx files
- [ ] Move css-comparison to ComponentsSection
- [ ] Create debug toolbar with compact/expanded modes
- [ ] Implement playground page entry points
- [ ] Update documentation:
  - [ ] Document navigation patterns
  - [ ] Update playground structure docs
  - [ ] Document examples pattern for components

### Phase hash-router

#### MVP Scope

- Basic routing for essential sections only
- Manual hash handling if simpler

#### Full Implementation

- [ ] Decide on routing approach (HashRouter vs manual)
- [ ] Implement basic routing (MVP)
- [ ] Add all planned sections
- [ ] Test navigation between sections
- [ ] Update documentation:
  - [ ] Document routing approach
  - [ ] Update URL structure docs
  - [ ] Final review of all documentation
  - [ ] Ensure all examples match new structure

## Documentation Strategy

### Key Principle

**Update documentation at the end of each phase** to ensure:

- Docs always reflect current state
- Examples are accurate and tested
- No outdated information persists
- Changes are properly communicated

### Documentation Files to Update

1. **CLAUDE.md** - AI assistant guidelines
2. **README.md** - Project overview
3. **DEVELOPMENT.md** - Development setup
4. **Component docs** - Usage examples
5. **This MIGRATION_PLAN.md** - Mark completed items
6. **ARCHITECTURE.md** - Update with decisions made

## Rollback Plan

If issues occur, the git history has the full implementation that can be restored. Each phase should be tagged for easy rollback:

```bash
git tag phase-css-simplification-complete
git tag phase-component-reorganization-complete
# etc.
```

## Success Criteria

Each phase is considered complete when:

1. All MVP features are implemented and working
2. Tests pass (build, lint, typecheck)
3. Documentation is updated
4. Code is reviewed and merged
5. No regressions in existing functionality

## Next Steps

1. Review and approve this plan
2. Create tracking issues for each phase
3. Begin with Phase css-simplification MVP
4. Iterate based on learnings
