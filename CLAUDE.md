# CLAUDE.md

This file provides guidance to AI Agent like Claude Code (claude.ai/code) when working with code in this repository.

See @README.md for repo overview.

## CRITICAL RULES - MUST FOLLOW

### 0. THINK DEEPLY AND PLAN

**THINK DEEPLY AND PLAN** before acting.

### 1. NO UNNECESSARY COMMENTS

**DO NOT ADD COMMENTS** unless the code is genuinely unclear or complex.
Most code should be self-documenting through good naming and structure.

**BAD examples (DO NOT DO THIS):**

```javascript
// Start the server
server.start();

// Define user interface
interface User {
  name: string;
}
```

**GOOD examples (ONLY when truly needed):**

```javascript
// Implements Fisher-Yates shuffle algorithm
function shuffle(array) {}

// Workaround for Firefox bug #12345
element.style.display = "none";
setTimeout(() => (element.style.display = ""), 0);
```

Only add comments when:

- The code uses a non-obvious algorithm or mathematical formula
- There's a workaround for a specific bug or browser quirk
- The business logic is genuinely complex and not evident from the code

### 2. ENGINEERING PHILOSOPHY

Be a **pragmatic, experienced engineer** who values:

#### Clean Architecture & DRY Principles

- Extract common functionality into reusable utilities
- Eliminate code duplication ruthlessly
- Prefer composition over repetition
- Create abstractions when patterns emerge

#### Type Safety & Error Handling

- Use proper error handling patterns
- Make invalid states unrepresentable through types
- Prefer compile-time errors over runtime errors
- For example:
  - NEVER use `any` type in TypeScript - use proper types or `unknown` with type guards

#### Code Organization

- Keep files small and focused on a single responsibility
- Maintain clear separation of concerns
- Use descriptive names that make code self-documenting

#### Pragmatic Solutions

- Use existing well-tested libraries over custom implementations
- Think deeply before refactoring - make meaningful changes
- Balance perfectionism with shipping working code

#### Quality Assurance

- ALWAYS run appropriate linters and formatters before committing
- Fix issues locally rather than pushing broken code
- Test changes thoroughly

## Project Structure

```text
nebulae/
├── scripts/          # Minimal bash scripts
│   └── bootstrap.sh  # Initial setup only
├── README.md         # Project overview
├── CLAUDE.md         # This file
├── AGENTS.md         # Symlink to CLAUDE.md
└── GEMINI.md         # Symlink to CLAUDE.md
```

## Repository Guidelines

### Pre-commit Configuration

All pre-commit hooks are managed in the root `.pre-commit-config.yaml` file. When adding a new tool:

1. Add tool-specific hooks with appropriate file patterns (e.g., `^newtool/.*\.py$`)
2. Prefix hook IDs with the tool name (e.g., `tanaka-rustfmt`)
3. Add "(toolname)" to hook names for clarity

### Code Style

- Prefer higher-level languages (Python, Go, etc.) over bash for complex logic
- Keep bash scripts minimal and focused on bootstrapping only

### Tool Development

- Each tool lives in its own directory under root
- Tools are self-contained with their own dependencies and README.md
- Each tool manages its own build/test/lint/deploy setup

### Requirements

- DO NOT create new bash scripts unless absolutely necessary for bootstrapping
- ALWAYS check existing tool directories before creating new ones
- ALWAYS document tool-specific commands in the tool's README.md
- ALWAYS test changes before suggesting commits
- Prefer editing existing files over creating new ones
- NEVER proactively create documentation files (*.md) unless explicitly requested
- ALWAYS use ASCII characters in markdown documents (checkmarks: `[x]`/`[ ]`, arrows: `->`, bullets: `-`)
- Avoid Unicode symbols like ✓, ✗, →, ▲ for compatibility across terminals and platforms

### Documentation Standards

The monorepo has established documentation guidelines:

- **Git Guidelines** (@docs/GIT.md): Commit message format, pre-commit hooks, selective staging
- **Markdown Style Guide** (@docs/MARKDOWN.md): GFM formatting, file conventions, GitHub features

These provide streamlined, practical standards suitable for both personal and professional projects.

### Writing Testable Code

#### Core Principles

- Dependency injection for easy mocking
- Single responsibility per class/function
- Prefer pure functions
- Test interfaces, not implementations

### Git Workflow

- NEVER push directly to main branch
- All changes must go through PR review process
- Include in PR description:
  - Brief summary of changes
  - Concise list of files modified

### Commit Messages

Follow the conventional commit format from @docs/GIT.md:

```text
<type>: <description>

<optional body>
```

**Types:**

- `feat` - New features or functionality
- `fix` - Bug fixes
- `docs` - Documentation changes only
- `refactor` - Code restructuring without changing behavior
- `test` - Adding or fixing tests
- `chore` - Maintenance tasks (dependencies, config, etc.)

**Guidelines:**

- Keep first line under 72 characters
- Use present tense ("Add feature" not "Added feature")
- Don't capitalize first letter after type
- Don't end with period
- Small, frequent commits for single logical changes
- Focus on "why" rather than "what" in details
- Use precise technical verbs (e.g., "harden" for security improvements)

**Selective Staging:**

```bash
git add -p <file>        # Stage specific hunks interactively
git diff --cached        # Review staged changes
```

## Development Principles

### Incremental Progress

Each branch should be independently mergeable:

- No "big bang" PRs - break work into digestible pieces
- Each PR should leave the system in a working state

### Clean Architecture

Apply consistent patterns across the codebase:

- Consistent error handling
- Dependency injection for testability

## Quality Checklist

Before suggesting code changes:

- Code follows existing patterns in the codebase
- No unnecessary comments added
- Types are properly defined (no `any` in Typescript)
- Tests would pass with the changes
- Documentation is updated if needed
- Changes are focused and minimal
- Appropriate linters/formatters run locally

## Slash Commands

This section captures learned user preferences from slash command usage. Update these based on repeated patterns or
explicit user requests.

### Git Commit Preferences

- (Add user-specific commit preferences here as they emerge)
- Example: User prefers concise commit messages without details
- Example: User groups markdown files with related code changes

### Discussion Preferences  

- (Add user-specific discussion preferences here as they emerge)
- Example: User prefers technical depth over business considerations

### General Command Preferences

- (Add cross-command preferences here as they emerge)
- Example: User prefers minimal output over detailed explanations
