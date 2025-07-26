# Tanaka-Specific Guidelines

**This file inherits all guidelines from the root @../CLAUDE.md file.**

The following are Tanaka-specific additions and clarifications:

## Project Context

### Overview

Tanaka is a Firefox tab synchronization system built with:

- **Extension**: TypeScript WebExtension using custom JSON-based CRDT
- **Server**: Rust server using axum, tokio, and SQLite
- **Architecture**: Client-server with CRDT-based sync

### Documentation References

- **Project Overview**: @README.md
- **Architecture Details**: @docs/ARCHITECTURE.md
- **Development Setup**: @docs/DEVELOPMENT.md
- **Git Workflow**: @../docs/GIT.md
- **Getting Started**: @docs/GETTING-STARTED.md
- **Troubleshooting**: @docs/TROUBLESHOOTING.md

## AI Agent Guidelines

### Working with this Codebase

- Firefox WebExtension (TypeScript) + Rust backend server
- Extension uses custom JSON-based CRDT for tab synchronization
- Always check existing patterns in neighboring files before implementing
- Run `cargo fmt` and `pnpm run lint` before suggesting code changes
- Prefer editing existing files over creating new ones
- Ensure Firefox WebExtension API compatibility

### Project Structure

```text
tanaka/
├── extension/          # Firefox WebExtension (TypeScript, custom CRDT)
│   ├── src/
│   │   ├── background/      # Background script
│   │   ├── popup/          # Popup UI
│   │   ├── settings/       # Settings page
│   │   ├── manager/        # Manager page
│   │   ├── playground/     # React playground using Mantine UI
│   │   ├── components/     # Shared components
│   │   ├── di/            # Dependency injection
│   │   ├── storage/       # Storage providers
│   │   └── api/           # API providers
├── server/            # Rust Tanaka server (axum, tokio, SQLite)
│   └── config/        # Example configuration files
└── docs/              # Project documentation
```

**Important**: The playground uses React and Mantine UI framework. Keep minimal BEM classes (.tnk-*) for custom styling.

### Development Workflow

For Git workflow and commit guidelines, see @../docs/GIT.md

### Technical Patterns

#### Error Handling (Result Pattern)

```typescript
import { Result, ok, err } from "neverthrow";

enum SyncError {
  NetworkFailure = "NETWORK_FAILURE",
  InvalidData = "INVALID_DATA",
  AuthError = "AUTH_ERROR",
  ServerError = "SERVER_ERROR",
}

async function syncTabs(tabs: Tab[]): Promise<Result<SyncResponse, SyncError>> {
  if (!tabs.length) return err(SyncError.InvalidData);

  try {
    const response = await api.sync(tabs);
    if (!response.ok) {
      return err(response.status === 401 ? SyncError.AuthError : SyncError.ServerError);
    }
    return ok(response.data);
  } catch (e) {
    return err(SyncError.NetworkFailure);
  }
}

// Chain operations safely
const result = await syncTabs(tabs)
  .map((data) => updateLocalState(data))
  .mapErr(handleError);
```

#### TypeScript Guidelines

```typescript
// Define types based on your data model
interface Tab {
  id: string;
  url: string;
  title: string;
  windowId: string;
  index: number;
  active: boolean;
}

// Extend when needed
interface TabWithMetadata extends Tab {
  lastAccessed: number;
  syncStatus: "pending" | "synced" | "error";
}

// Type guards for runtime validation
function isValidTab(obj: unknown): obj is Tab {
  return typeof obj === "object" && obj !== null && "id" in obj && "url" in obj && typeof (obj as Tab).id === "string";
}

// Discriminated unions for messages
type BackgroundMessage =
  | { type: "TRACK_WINDOW"; windowId: number }
  | { type: "UNTRACK_WINDOW"; windowId: number }
  | { type: "SYNC_NOW" }
  | { type: "GET_STATUS" };
```

#### Performance Best Practices

1. **Memory**: Use browser storage instead of keeping all data in memory
2. **Events**: Debounce frequent events (tab updates, etc.)
3. **Heavy ops**: Use Web Workers for CRDT operations
4. **Loading**: Lazy load non-critical features
5. **Storage**: Batch writes instead of multiple small writes
6. **Monitoring**: Use performance marks for critical operations

### Writing Testable Code

Follow the testable code principles from @../CLAUDE.md with these Tanaka-specific patterns:

```typescript
// Good - dependencies injected
class SyncManager {
  constructor(private api: TanakaAPI, private tracker: WindowTracker) {}
}

// Bad - hardcoded dependencies
class SyncManager {
  private api = new TanakaAPI("https://api.com");
}
```

### Common Issues & Solutions

#### Documentation

- Keep configuration examples in GETTING-STARTED.md
- Follow the documentation structure in docs/
- AGENTS.md is a symlink to CLAUDE.md (changes affect both)
- GEMINI.md is a symlink to CLAUDE.md (changes affect both)

### Project Organization

- Keep language/framework-specific files in their respective directories
- Repository-level tools (like git hooks) belong at the repository root
- Run commands from the appropriate directory context
- Always verify file contents after moving or modifying them

### CSS Architecture Philosophy

**Keep it simple**: Use Mantine's defaults instead of creating custom design systems.

- **NO custom CSS variable systems** - Removed 926 lines of unnecessary CSS variables
- **Use Mantine props directly** - `size`, `color`, `variant`, `radius`, etc.
- **Minimal custom CSS** - Only for specific component needs
- **ThemeProvider HOC** - Centralized minimal theme customization
- **No over-engineering** - If Mantine provides it, use it

### Memory Management

- After compacting, read the docs and this guide to refresh your instructions
- Proactively suggest adding patterns/lessons to documentation
- Always run pre-commit checks before committing
- Fix markdown linting issues
- **File References**: Use @<path> notation for file references in CLAUDE.md (not Markdown links)
- **Documentation Updates**: Always check and update relevant documentation when making major changes
- **Before Pull Requests**: Review all docs for accuracy - feature status, version numbers, commands, and technical
details must match the code

### Essential Commands

See @docs/DEVELOPMENT.md for all development commands.

### Development TODOs

Track development tasks using appropriate task management tools.

#### Key Development Principles

1. **Unified Changes**: Related extension and server changes in same branch
   - Frontend and backend changes that depend on each other ship together
   - Reduces integration bugs and deployment complexity
   - Example: New CRDT operation needs both extension handler and server endpoint

2. **Incremental Progress**: Each branch should be independently mergeable
   - No "big bang" PRs - break work into digestible pieces
   - Each PR should leave the system in a working state
   - Feature flags for gradual rollout of larger changes

3. **Test Everything**: Both sides need comprehensive tests
   - Unit tests for business logic (aim for 80%+ coverage)
   - Integration tests for critical paths (sync, auth, persistence)
   - Manual testing checklist for UI changes
   - Performance benchmarks for changes affecting 200+ tabs

4. **Performance First**: Every change considers 200+ tab scenarios
   - Profile memory usage before and after changes
   - Measure sync latency impact
   - Consider battery life implications
   - Use Web Workers for heavy operations

5. **Clean Architecture**: Apply same patterns to both extension and server
   - Consistent error handling (Result types)
   - Shared domain models via code generation
   - Repository pattern for data access
   - Service layer for business logic

#### Progress Tracking Rules

##### Task Management

- ALWAYS use ASCII characters in markdown (checkmarks: `[x]`/`[ ]`, arrows: `->`, bullets: `-`)
- Use `[ ]` for pending, `[x]` for completed tasks
- Break large tasks into subtasks when complexity emerges
- Add discovered work as new tasks rather than expanding existing ones
- Mark tasks complete only when fully done (not partially)

##### Pull Request Workflow

- **Always create a PR when a branch is ready for review**
- Update TODO file as part of each PR that completes tasks
- Include in PR description:
  - Which TODO tasks are addressed
  - Testing performed (automated + manual)
  - Performance impact analysis
  - Screenshots for UI changes

##### Quality Gates

- Run all tests before marking complete (`cargo nextest run` + `pnpm test`)
- Ensure pre-commit hooks pass (`pre-commit run --all-files`)
- Verify no memory leaks introduced (test with 200+ tabs)
- Update relevant documentation (user guides, API docs, comments)

##### Branch Protection

See @../docs/GIT.md for branch protection and PR workflow guidelines.

### Misc

- AGENTS.md is a symlink to this file for compatibility (used by OpenAI's Codex)
- GEMINI.md is a symlink to this file for compatibility (used by Google's Gemini)
- The project uses semantic versioning - update versions in `manifest.json` and `Cargo.toml`

## Quality Checklist

See @../CLAUDE.md for the quality checklist. Additionally for Tanaka:

- Ensure Firefox WebExtension API compatibility
- Test with 200+ tabs for performance
- Verify CRDT operations maintain consistency
